/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Favorites {
    export class FavoritesModule extends ModuleBase implements ISitecoreExtensionsModule {
        options: FavoritesOptions;
        store: FavoritesStore;
        private ribbonTabId: string = 'sc-ext-favorites-ribbon-tab';
        private ribbonStripId: string = 'sc-ext-favorites-ribbon-strip';
        private starClass: string = 'sc-ext-favorites-star';

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description);
            this.options = new FavoritesOptions(rawOptions);
            this.store = new FavoritesStore(this.options.storageType, this.options.shareAcrossInstances, this.options.maxItems);
        }

        public canExecute(): boolean {
            return this.options.enabled;
        }

        public initialize(): void {
            if (Context.Location() != Enums.Location.ContentEditor) return;
            window.addEventListener('load', () => this.refresh());
            SitecorePageBridge.on('page:changed', () => { this.refresh(); });
            this.refresh();
        }

        public canCapture(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor && this.getCurrentItemId() != null;
        }

        public isCurrentFavorite(): boolean {
            var id = this.getCurrentItemId();
            return id != null && this.store.containsCached(id, Context.Database(), window.top.location.host);
        }

        public getCurrentItemName(): string {
            var node = new PageObjects.ContentTree().getActiveTreeNode();
            var anchor = node == null ? null : (node.tagName == 'A' ? node : node.querySelector('a'));
            return anchor == null ? (this.getCurrentItemId() || 'current item') : (<HTMLElement>anchor).innerText.trim();
        }

        public async addCurrent(): Promise<void> {
            var favorite = this.captureCurrent();
            if (favorite == null) return;
            await this.store.add(favorite);
            this.refresh();
        }

        public async removeCurrent(): Promise<void> {
            var id = this.getCurrentItemId();
            if (id == null) return;
            await this.store.remove(id, Context.Database(), window.top.location.host);
            this.refresh();
        }

        public async clear(): Promise<void> {
            await this.store.clear();
            this.refresh();
        }

        private async refresh(): Promise<void> {
            if (!this.canCapture()) return;
            var id = this.getCurrentItemId();
            if (await this.store.contains(id, Context.Database(), window.top.location.host)) {
                var current = (await this.store.all()).filter(favorite =>
                    favorite.id.toLowerCase() == id.toLowerCase() &&
                    favorite.database == Context.Database() &&
                    favorite.host == window.top.location.host)[0];
                if (current != null && current.name.toLowerCase() == id.toLowerCase()) {
                    await this.store.add(this.captureCurrent());
                }
            }
            if (this.options.showToolbarButton) this.injectRibbonTab();
            if (this.options.showQuickInfoStar) this.injectHeaderStar();
            this.updateStar();
        }

        private captureCurrent(): Favorite {
            var id = this.getCurrentItemId();
            if (id == null) return null;

            var node = new PageObjects.ContentTree().getActiveTreeNode();
            var image = node == null ? null : node.querySelector('img') as HTMLImageElement;
            var favorite = new Favorite();
            favorite.id = id;
            favorite.name = this.getCurrentItemName();
            favorite.path = this.getItemPath();
            favorite.icon = image == null ? '/sitecore/images/blank.gif' : image.src;
            favorite.database = Context.Database();
            favorite.language = Context.Language();
            favorite.host = window.top.location.host;
            favorite.createdAt = Date.now();
            return favorite;
        }

        private getCurrentItemId(): string {
            try {
                return Context.ItemID();
            } catch (_) {
                return null;
            }
        }

        private getItemPath(): string {
            var rows = document.querySelectorAll('.scEditorQuickInfo tr');
            for (var index = 0; index < rows.length; index++) {
                var cells = rows[index].querySelectorAll('td');
                if (cells.length < 2 || cells[0].textContent.trim().toLowerCase().replace(':', '') != 'item path') continue;
                var input = cells[1].querySelector('input') as HTMLInputElement;
                return input == null ? cells[1].textContent.trim() : input.value;
            }
            return '';
        }

        private injectRibbonTab(): void {
            var navigator = document.querySelector('.scRibbonNavigatorButtonsGroupButtons');
            var toolbar = document.querySelector('.scRibbonToolbar');
            if (navigator == null || toolbar == null) return;

            var existingTab = document.getElementById(this.ribbonTabId);
            if (existingTab != null) {
                navigator.appendChild(existingTab);
                var existingStrip = document.getElementById(this.ribbonStripId);
                var existingContextualToolbar = toolbar.querySelector('[id$="_ContextualToolbar"]');
                if (existingStrip != null) toolbar.insertBefore(existingStrip, existingContextualToolbar);
                return;
            }

            var tab = HTMLHelpers.createElement<HTMLAnchorElement>('a', {
                id: this.ribbonTabId,
                href: '#',
                class: 'scRibbonNavigatorButtonsNormal',
                role: 'tab',
                'aria-selected': 'false',
                'aria-controls': this.ribbonStripId,
                tabindex: '-1'
            });
            tab.innerText = 'Favorites';
            tab.onclick = event => {
                event.preventDefault();
                this.activateRibbonTab(tab);
            };
            navigator.appendChild(tab);

            var strip = this.createRibbonStrip();
            var contextualToolbar = toolbar.querySelector('[id$="_ContextualToolbar"]');
            toolbar.insertBefore(strip, contextualToolbar);

            var nativeTabs = navigator.querySelectorAll('a:not(#' + this.ribbonTabId + ')');
            for (var index = 0; index < nativeTabs.length; index++) {
                nativeTabs[index].addEventListener('click', () => this.deactivateRibbonTab(tab, strip));
            }
        }

        private createRibbonStrip(): HTMLDivElement {
            var strip = HTMLHelpers.createElement<HTMLDivElement>('div', {
                id: this.ribbonStripId,
                class: 'scRibbonToolbarStrip',
                role: 'tabpanel',
                'aria-label': 'Favorites'
            });
            strip.style.display = 'none';

            var chunk = HTMLHelpers.createElement<HTMLDivElement>('div', {
                class: 'chunk sc-ext-favorites-ribbon-chunk',
                role: 'group',
                'aria-labelledby': 'sc-ext-favorites-ribbon-caption'
            });
            var panel = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'panel' });
            var button = HTMLHelpers.createElement<HTMLAnchorElement>('a', {
                href: '#',
                class: 'scRibbonToolbarLargeButton',
                role: 'button',
                'aria-label': 'Open favorites',
                title: 'Open extension favorites'
            });
            var icon = HTMLHelpers.createElement<HTMLImageElement>('img', {
                src: '/temp/iconcache/office/24x24/star.png',
                class: 'scRibbonToolbarLargeButtonIcon',
                alt: ''
            });
            var label = HTMLHelpers.createElement<HTMLSpanElement>('span', { class: 'header' });
            label.innerText = 'Open favorites';
            button.appendChild(icon);
            button.appendChild(label);
            button.onclick = event => {
                event.preventDefault();
                this.getLauncher().openNested('Favorites');
            };
            panel.appendChild(button);

            var caption = HTMLHelpers.createElement<HTMLDivElement>('div', {
                id: 'sc-ext-favorites-ribbon-caption', class: 'caption'
            });
            caption.innerText = 'Favorites';
            chunk.appendChild(panel);
            chunk.appendChild(caption);
            strip.appendChild(chunk);
            return strip;
        }

        private activateRibbonTab(tab: HTMLAnchorElement): void {
            var ribbon = HTMLHelpers.getElement(tab, element => element.classList.contains('scRibbon'));
            if (ribbon == null) return;
            var tabs = ribbon.querySelectorAll('.scRibbonNavigatorButtonsGroupButtons > a');
            for (var index = 0; index < tabs.length; index++) {
                tabs[index].className = 'scRibbonNavigatorButtonsNormal';
                tabs[index].setAttribute('aria-selected', 'false');
                tabs[index].setAttribute('tabindex', '-1');
            }
            var strips = ribbon.querySelectorAll('.scRibbonToolbarStrip');
            for (var stripIndex = 0; stripIndex < strips.length; stripIndex++) {
                (<HTMLElement>strips[stripIndex]).style.display = 'none';
            }
            tab.className = 'scRibbonNavigatorButtonsActive';
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');
            document.getElementById(this.ribbonStripId).style.display = '';
        }

        private deactivateRibbonTab(tab: HTMLAnchorElement, strip: HTMLDivElement): void {
            tab.className = 'scRibbonNavigatorButtonsNormal';
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            strip.style.display = 'none';
        }

        private injectHeaderStar(): void {
            if (document.querySelector('.' + this.starClass)) return;
            var header = document.querySelector('.scEditorHeader');
            if (header == null) return;
            header.classList.add('sc-ext-favorites-header');

            var star = HTMLHelpers.createElement<HTMLSpanElement>('span', {
                class: this.starClass, title: 'Add to favorites', role: 'button', tabindex: '0'
            });
            star.onclick = event => {
                event.preventDefault();
                this.isCurrentFavorite() ? this.removeCurrent() : this.addCurrent();
            };
            star.onkeydown = event => {
                if (event.keyCode != 13 && event.keyCode != 32) return;
                event.preventDefault();
                this.isCurrentFavorite() ? this.removeCurrent() : this.addCurrent();
            };
            header.appendChild(star);
        }

        private updateStar(): void {
            var star = document.querySelector('.' + this.starClass) as HTMLElement;
            if (star == null) return;
            var saved = this.isCurrentFavorite();
            star.className = this.starClass + (saved ? ' saved' : '');
            star.title = saved ? 'Remove from favorites' : 'Add to favorites';
        }

        private getLauncher(): Launcher.LauncherModule {
            return <Launcher.LauncherModule>scExtManager.getModule(Launcher.LauncherModule);
        }
    }
}