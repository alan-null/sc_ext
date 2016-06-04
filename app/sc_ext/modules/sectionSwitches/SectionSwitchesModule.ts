/// <reference path='_all.ts'/>

namespace SitecoreExtensions.Modules.SectionSwitches {
    export class SectionSwitchesModule extends ModuleBase implements ISitecoreExtensionsModule {
        sectionSwitchButtonClassName: string;
        constructor(name: string, description: string) {
            super(name, description);
            this.sectionSwitchButtonClassName = 'scEButton';
        }

        closeOpenedSections() {
            HTMLHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
        };

        openClosedSections() {
            HTMLHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
        };

        createTabControlButton(text: string, callback: { (e: MouseEvent): any }): HTMLAnchorElement {
            var span = HTMLHelpers.createElement<HTMLSpanElement>('span', {});
            span.innerText = text
            var link = HTMLHelpers.createElement<HTMLAnchorElement>('a', {
                href: '#',
                class: 'scEditorHeaderNavigator scEditorHeaderButton scButton ' + this.sectionSwitchButtonClassName
            });
            link.onclick = callback;
            link.appendChild(span);
            return link;
        }

        private insertButtons(): void {
            var btnCollapse = this.createTabControlButton('Collapse', this.closeOpenedSections)
            var btnExpand = this.createTabControlButton('Expand', this.openClosedSections)

            var controlsTab = document.querySelector('.scEditorTabControlsTab5');
            controlsTab.insertBefore(btnCollapse, controlsTab.firstChild);
            controlsTab.insertBefore(btnExpand, controlsTab.firstChild);
        };

        buttonsExists(): boolean {
            return document.getElementsByClassName(this.sectionSwitchButtonClassName).length > 0
        }

        refreshButtons(): void {
            if (!this.buttonsExists()) {
                this.insertButtons();
            }
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.refreshButtons();
                    }, 10);
                });
            }
        }

        canExecute(): boolean {
            return Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.insertButtons());
            this.addTreeNodeHandlers('scContentTree');
            HTMLHelpers.addProxy(scSitecore, 'postEvent', () => { this.refreshButtons(); });
            HTMLHelpers.addProxy(scForm, 'invoke', () => { this.refreshButtons(); });
        }
    }
}
