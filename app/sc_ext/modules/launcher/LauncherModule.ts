/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher {
    import SearchResult = Launcher.Models.SearchResult;
    import SitecoreSearchResults = Launcher.Models.SitecoreSearchResults;
    import UserActionEvent = Providers.UserActionEvent;

    export class LauncherModule extends ModuleBase implements ISitecoreExtensionsModule {
        modalElement: HTMLDivElement;
        searchResultsElement: HTMLUListElement;
        searchBoxElement: HTMLInputElement;
        selectedCommand: HTMLCollection;
        commands: ICommand[];
        fuzzy: Libraries.Fuzzy;
        delayedSearch: any;
        resultsDelay: number = 300;
        recentCommandsStore: RecentCommandsStore;
        idParser: IdParser;
        options: Models.LauncherOptions;
        private selectedTermClass: string = 'sc-ext-selected-term';

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description);

            this.options = new Models.LauncherOptions(rawOptions);

            this.commands = new Array<ICommand>();

            this.registerModuleCommands();
            this.fuzzy = new Libraries.Fuzzy();
            this.recentCommandsStore = new RecentCommandsStore(this.options.searchResultsCount, this.options.storageType);
        }

        canExecute(): boolean {
            return true && this.options.enabled && this.isValidContext();
        }

        initialize(): void {
            this.injectlauncherHtml();
            this.registerGlobalShortcuts();
            this.registerInternalCommands();
            if (Context.Location() == Enums.Location.ContentEditor) {
                this.addFlowConditionForKeyDownEvent();
            }
            this.modalElement = <HTMLDivElement>document.getElementById('sc-ext-modal');
            this.searchBoxElement = <HTMLInputElement>document.getElementById('sc-ext-searchBox');
            this.searchResultsElement = <HTMLUListElement>document.getElementById('sc-ext-searchResults');
            this.selectedCommand = document.getElementsByClassName(this.selectedTermClass) as HTMLCollection;

            this.fuzzy.highlighting.before = "<span class='term'>";
            this.fuzzy.highlighting.after = '</span>';
            this.idParser = new IdParser();

            this.modalElement.onclick = (e) => {
                if (e.getSrcElement() == this.modalElement) {
                    this.hideLauncher();
                }
            };
        }

        registerProviderCommands(provider: Providers.ICommandsProvider): void {
            this.registerCommands(provider.getCommands());
        }

        registerCommands(commands: ICommand[]): void {
            commands.forEach(cmd => { this.registerCommand(cmd); });
        }

        registerCommand(command: ICommand): void {
            if (this.isUnique(command)) {
                command.id = this.commands.length + 1;
                this.commands.push(command);
            }
        }

        showLauncher(): void {
            this.modalElement.style.display = 'block';
            this.searchBoxElement.focus();
        }

        hideLauncher(): void {
            this.modalElement.style.display = 'none';
            this.searchBoxElement.value = '';
            this.clearResults();
        }

        clearResults(): void {
            this.searchResultsElement.className = 'term-list hidden';
            this.searchResultsElement.innerHTML = '';
        }


        injectlauncherHtml(): void {
            var modal = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'launcher-modal', id: 'sc-ext-modal' });
            var div = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'launcher-modal-content' });
            var input = HTMLHelpers.createElement<HTMLInputElement>('input', { class: 'search-field', id: 'sc-ext-searchBox', autocomplete: this.options.autocomplete ?  "on" : "off" });

            var ul = HTMLHelpers.createElement<HTMLUListElement>('ul', { class: 'term-list hidden', id: 'sc-ext-searchResults' });
            input.onkeyup = (e) => this.inputKeyUpEvent(e);
            div.appendChild(input);
            div.appendChild(ul);
            window.onclick = (e) => this.windowClickEvent(e);
            modal.appendChild(div);
            document.querySelector('body').appendChild(modal);
        }

        registerGlobalShortcuts(): void {
            document.onkeydown = (evt: KeyboardEvent) => {
                evt = (evt != null ? evt : <KeyboardEvent>window.event);
                switch (evt.which || evt.keyCode) {
                    case this.options.keyBindings.show: {
                        if (evt.ctrlKey) {
                            this.showLauncher();
                            break;
                        }
                        return;
                    }
                    case this.options.keyBindings.hide: {
                        if (evt.target == this.searchBoxElement) {
                            this.hideLauncher();
                        }
                        break;
                    }
                    default: return;
                }
                evt.preventDefault();
            };
        }

        addFlowConditionForKeyDownEvent(): void {
            HTMLHelpers.addFlowConditionToEvent(scSitecore, 'onKeyDown', (evt: KeyboardEvent) => {
                evt = (evt != null ? evt : <KeyboardEvent>window.event);
                return (evt as any).element().id != 'sc-ext-searchBox';
            });
        }

        executeSelectedCommand(evt?: UserActionEvent): void {
            if (!this.selectedCommand[0]) return;
            var id = (<HTMLLIElement>this.selectedCommand[0]).dataset['id'];
            if (this.idParser.match(id)) {
                if (Context.Location() == Enums.Location.ContentEditor) {
                    let contentTree = new PageObjects.ContentTree();
                    contentTree.loadItem(id);
                } else {
                    new Providers.LaunchpadShortcutCommand("", "", "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=" + id).execute(evt);
                }

            } else {
                var selectedComandId = parseInt(id);
                var command = <ICommand>this.commands.find((cmd: ICommand) => {
                    return cmd.id == selectedComandId;
                });
                command.execute(evt);
                this.recentCommandsStore.add(command);
            }
            this.hideLauncher();
        }

        inputKeyUpEvent(evt: KeyboardEvent): void {
            if (evt.keyCode == this.options.keyBindings.executeCommand && this.selectedCommand[0]) {
                this.executeSelectedCommand(evt);
                return;
            }
            if (evt.keyCode == this.options.keyBindings.selectPrevResult
                || evt.keyCode == this.options.keyBindings.selectNextResult
                || evt.keyCode == this.options.keyBindings.selectLastResult
                || evt.keyCode == this.options.keyBindings.selectFirstResult) {
                this.commandSelectionEvent(evt);
            } else {
                let phrase = this.searchBoxElement.value;
                if (phrase.length == 0) {
                    (async () => {
                        var recentResults = new Array<SearchResult>();
                        var recentCommands = await this.recentCommandsStore.getRecentCommands(this.commands);
                        recentCommands.forEach(cmd => { recentResults.push(SearchResult.Cast(cmd)); });
                        this.appendResults(recentResults);
                        this.selectFirstResult();
                    })();
                } else {
                    if (phrase.startsWith("#") && phrase.length >= 1) {
                        phrase = phrase.substring(phrase.indexOf("#") + 1);
                        if (phrase.match("^ *$") == null) {
                            this.searchItems(phrase);
                        }
                    } else {
                        var results = this.searchCommands(phrase);
                        this.appendResults(results);
                        this.selectFirstResult();
                    }
                }
            }
        }


        windowClickEvent(evt: MouseEvent): void {
            if (evt.target == this.modalElement) {
                this.modalElement.style.display = 'none';
                this.searchBoxElement.value = '';
            }
        }

        changeSelectedCommand(newSelected): void {
            var oldSelected = <HTMLLIElement>this.searchResultsElement.querySelector('.' + this.selectedTermClass);
            if (oldSelected) {
                oldSelected.removeAttribute('class');
                newSelected.setAttribute('class', this.selectedTermClass);
            }
        }

        commandSelectionEvent(evt: KeyboardEvent): void {
            var commands = this.searchResultsElement.querySelectorAll('li');
            if (commands.length > 0) {
                var selected = <HTMLLIElement>this.searchResultsElement.querySelector('.' + this.selectedTermClass);
                if (selected == undefined) selected = <HTMLLIElement>this.searchResultsElement.querySelector('li');

                if (evt.keyCode == this.options.keyBindings.selectPrevResult && commands[0] != selected) {
                    if (selected.className == this.selectedTermClass) {
                        this.changeSelectedCommand(selected.previousSibling);
                    }
                }

                if (evt.keyCode == this.options.keyBindings.selectNextResult && commands.length != 0) {
                    if (selected.className == this.selectedTermClass && commands[commands.length - 1] !== selected) {
                        this.changeSelectedCommand(selected.nextSibling);
                    }
                }

                if (evt.keyCode == this.options.keyBindings.selectLastResult && commands.length != 0) {
                    if (selected.className == this.selectedTermClass && commands[commands.length - 1] !== selected) {
                        this.changeSelectedCommand(commands[commands.length - 1]);
                    }
                }

                if (evt.keyCode == this.options.keyBindings.selectFirstResult && commands.length != 0) {
                    if (selected.className == this.selectedTermClass && commands[0] !== selected) {
                        this.changeSelectedCommand(commands[0]);
                    }
                }
            }
        }

        private isValidContext(): boolean {
            if (window.frameElement) {
                return window.frameElement.id != 'Editor_contentIframe' && window.frameElement.id != 'holder';
            }
            return true;
        }

        private selectFirstResult(): void {
            if (this.searchResultsElement.children.length > 0) {
                (<HTMLLIElement>this.searchResultsElement.firstChild).setAttribute('class', this.selectedTermClass);
            }
        }
        private canBeExecuted(command: ICommand, index: number, array: ICommand[]): boolean {
            return command.canExecute();
        }

        private searchCommands(query: string): SearchResult[] {
            var results = new Array<SearchResult>();
            var i;

            if (query === '') {
                return [];
            }

            var availableCommands = this.commands.filter(this.canBeExecuted);

            for (i = 0; i < availableCommands.length; i++) {
                var cmd = availableCommands[i];
                var f = this.fuzzy.getScore(cmd.name, query);
                results[i] = <SearchResult>{
                    command: cmd,
                    score: f.score,
                    term: f.term,
                    highlightedTerm: f.highlightedTerm,
                };
            }
            results.sort(this.fuzzy.matchComparator);
            return results.slice(0, this.options.searchResultsCount);
        }

        private searchItems(phrase: string) {
            var searchEndpointUrl = window.top.location.origin + "/sitecore/shell/applications/search/instant/instantsearch.aspx";
            var request = new Http.HttpRequest(searchEndpointUrl + "?q=" + phrase + "&v=1", Http.Method.POST, (e) => {
                var data = e.currentTarget.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");

                var categories = doc.querySelectorAll(".scSearchResultsTable td");
                var currentCategoryName = "Uncategorized";
                var results = new Array<SitecoreSearchResults>();
                for (var index = 0; index < categories.length; index++) {
                    var td = categories[index] as HTMLTableDataCellElement;
                    if (td.attributes['rowspan'] != undefined) {
                        currentCategoryName = td.innerText;
                    } else {
                        var link = td.querySelector("a") as HTMLAnchorElement;
                        var result = new SitecoreSearchResults();
                        result.category = currentCategoryName;
                        result.path = link.title;
                        result.id = this.idParser.extractID(link.attributes['href'].nodeValue);
                        result.title = link.innerText;
                        result.img = (link.querySelector("img") as HTMLImageElement).attributes['src'].nodeValue;
                        if (result.id) {
                            results.push(result);
                        }
                    }
                }

                if (this.searchResultsElement.className !== 'term-list') {
                    this.searchResultsElement.className = 'term-list';
                }

                if (results.length > 0) {
                    for (var i = 0; i < results.length && i < this.options.searchResultsCount; i++) {
                        var li = this.buildItemHtml(results[i]);
                        this.searchResultsElement.appendChild(li);
                    }
                    this.selectFirstResult();

                } else {
                    let mock = new SearchResult();
                    mock.command = this.getCommandByName('__no_results');
                    mock.highlightedTerm = "Nothing found";
                    var li = this.buildCommandHtml(mock);
                    while (this.searchResultsElement.firstChild != null) {
                        this.searchResultsElement.removeChild(this.searchResultsElement.firstChild);
                    }
                    this.searchResultsElement.appendChild(li);
                }
            });

            clearTimeout(this.delayedSearch);
            this.searchBoxElement.classList.add("sc-ext-search-progress");
            this.delayedSearch = setTimeout(() => {
                this.clearResults();
                this.searchBoxElement.classList.remove("sc-ext-search-progress");
                request.execute();
            }, this.resultsDelay);
        }

        private registerInternalCommands() {
            var noResultsCommand: ICommand = {
                id: -1,
                name: '__no_results',
                description: 'Nothing found or quick search index was not rebuild.',
                execute: _ => { },
                canExecute: () => { return false; }
            };
            this.registerCommand(noResultsCommand);
        }

        private isUnique(command: ICommand): boolean {
            return this.commands.filter(c => c.name == command.name && c.canExecute() == command.canExecute()).length == 0;
        }

        private getCommandByName(name: string): ICommand {
            return this.commands.filter(c => c.name == name)[0];
        }

        private registerModuleCommands(): void {
            this.registerProviderCommands(new Launcher.Providers.ShellCommandsProvider());
            this.registerProviderCommands(new Launcher.Providers.ContentEditorCommandsProvider());
            this.registerProviderCommands(new Launcher.Providers.ContentEditorRibbonCommandsProvider());
            this.registerProviderCommands(new Launcher.Providers.AdminShortcutsCommandsProvider());
            this.registerProviderCommands(new Launcher.Providers.LaunchpadCommandsProvider());
        }

        private appendResults(sortedResults: SearchResult[]): void {
            this.clearResults();
            if (sortedResults.length > 0) {
                for (var i = 0; i < sortedResults.length && i < this.options.searchResultsCount; i++) {
                    var li = this.buildCommandHtml(sortedResults[i]);
                    this.searchResultsElement.appendChild(li);
                }

                if (this.searchResultsElement.className !== 'term-list') {
                    this.searchResultsElement.className = 'term-list';
                }
            }
        }

        private buildCommandHtml(sr: SearchResult): HTMLLIElement {
            var li = HTMLHelpers.createElement<HTMLLIElement>('li', null, { id: sr.command.id });
            var spanName = HTMLHelpers.createElement<HTMLSpanElement>('span', { class: 'command-name' });
            spanName.innerHTML = sr.highlightedTerm;
            var spanDescription = HTMLHelpers.createElement<HTMLSpanElement>('span', { class: 'command-description' });
            spanDescription.innerText = sr.command.description;

            li.appendChild(spanName);
            li.appendChild(spanDescription);

            li.onclick = (e) => {
                var element = <Element>e.getSrcElement();
                while (element.tagName != 'LI') {
                    element = <Element>element.parentNode;
                }
                this.changeSelectedCommand(element);
                this.searchBoxElement.focus();
            };
            li.ondblclick = (e: UserActionEvent) => {
                this.executeSelectedCommand(e);
            };
            return li;
        }

        private buildItemHtml(sr: SitecoreSearchResults): HTMLLIElement {
            var li = HTMLHelpers.createElement<HTMLLIElement>('li', null, { id: sr.id });
            var spanName = HTMLHelpers.createElement<HTMLSpanElement>('span', { class: 'command-name' });
            spanName.innerHTML = sr.title;
            var spanDescription = HTMLHelpers.createElement<HTMLSpanElement>('span', { class: 'command-description' });
            spanDescription.innerText = sr.path;

            var img = HTMLHelpers.createElement<HTMLImageElement>('img', { src: sr.img, class: 'command-img' });
            li.appendChild(img);
            li.appendChild(spanName);
            li.appendChild(spanDescription);

            li.onclick = (e) => {
                var element = <Element>e.getSrcElement();
                while (element.tagName != 'LI') {
                    element = <Element>element.parentNode;
                }
                this.changeSelectedCommand(element);
                this.searchBoxElement.focus();
            };
            li.ondblclick = (e: UserActionEvent) => {
                this.executeSelectedCommand(e);
            };
            return li;
        }
    }
}
