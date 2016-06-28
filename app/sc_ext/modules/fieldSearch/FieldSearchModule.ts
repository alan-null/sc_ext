/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FieldSearch {
    export class FieldSearchModule extends ModuleBase implements ISitecoreExtensionsModule {
        searchString: string;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        };

        private createTextBox(text: string): HTMLInputElement {
            var input = HTMLHelpers.createElement<HTMLInputElement>('input', {
                id: 'scextFieldSearch',
                type: 'text',
                class: 'scSearchInput scIgnoreModified sc-ext-fieldSearch',
                placeholder: 'Search for fields'
            });
            var data = this;
            input.onkeyup = (e: KeyboardEvent) => {
                data.doSearch(e);
            };

            return input;
        };

        private createClearButton(text: string): HTMLSpanElement {
            var closeButton = HTMLHelpers.createElement<HTMLSpanElement>('span', {
                class: 'sc-ext-fieldSearchClear'
            });
            var data = this;
            closeButton.onclick = (e: MouseEvent) => {
                data.clearSearch(e);
            };

            return closeButton;
        };

        private castToArray(list): Element[] {
            return Array.prototype.slice.call(list);
        }

        private toggleSections(hide: boolean): void {
            var contentSection = document.getElementById("EditorPanel");
            var sectionsExpanded = contentSection.getElementsByClassName("scEditorSectionCaptionExpanded");
            var sectionsCollapsed = contentSection.getElementsByClassName("scEditorSectionCaptionCollapsed");
            var panels = contentSection.getElementsByClassName("scEditorSectionPanel");
            var fields = contentSection.getElementsByClassName("scEditorFieldMarker");
            var sections = this.castToArray(sectionsExpanded).concat(this.castToArray(sectionsCollapsed)).concat(this.castToArray(panels)).concat(this.castToArray(fields));


            sections.forEach(element => {
                if (hide) {
                    if (!element.classList.contains("sc-ext-hiddenElement")) {
                        element.classList.add("sc-ext-hiddenElement");
                    }
                } else {
                    element.classList.remove("sc-ext-hiddenElement");
                    element.classList.remove("sc-ext-forceExpandedElement");
                }
            });
        };

        private getParent(start: Node, cl: string): Element[] {
            var result = []
            var elem = start;
            for (; elem && elem !== document; elem = elem.parentNode) {
                var element = <Element>elem;
                if (element.classList.contains("scEditorSectionPanel") || element.classList.contains("scEditorFieldMarker")) {
                    result.push(element);
                }
            }
            return result;
        };

        private unhideResults(hits: Element[]): void {
            hits.forEach(element => {
                this.getParent(element, "scEditorSectionPanel").forEach(elem => {
                    elem.classList.remove("sc-ext-hiddenElement");


                    if (elem.classList.contains("scEditorSectionPanel")) {
                        elem.previousElementSibling.classList.remove("sc-ext-hiddenElement");

                        if (elem.previousElementSibling.classList.contains("scEditorSectionCaptionCollapsed")) {
                            elem.classList.add("sc-ext-forceExpandedElement");
                        }
                    }
                });
            });
        }

        private findFields(searchString: string): Element[] {
            var fieldLabels = this.castToArray(document.getElementsByClassName("scEditorFieldLabel"));
            var hits: Element[] = []
            fieldLabels.forEach(element => {
                if ((<HTMLElement>element).innerText.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
                    hits.push(element);
                }
            });
            return hits;
        }

        doSearch(e: KeyboardEvent): void {
            var char = document.getElementById("scextFieldSearch");
            var searchString = (<HTMLInputElement>char).value;

            if (searchString.length > 2) {
                this.toggleSections(true);
                var hits: Element[] = this.findFields(searchString);
                this.unhideResults(hits);
            } else {
                this.toggleSections(false);
            }
        };

        clearSearch(e: MouseEvent): void {
            var char = document.getElementById("scextFieldSearch");
            (<HTMLInputElement>char).value = "";
            this.toggleSections(false);
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.refreshSearchField();
                    }, 10);
                });
            }
        }

        private insertSearchField(): void {
            var txbSearch = this.createTextBox('Collapse')
            var spanClear = this.createClearButton('XXX');

            var span = HTMLHelpers.createElement<HTMLSpanElement>('span', {
                class: 'sc-ext-searchFieldContainer'
            });

            span.appendChild(txbSearch);
            span.appendChild(spanClear);

            var controlsTab = document.querySelector('.scEditorTabControlsTab5');
            controlsTab.insertBefore(span, controlsTab.firstChild);
        };

        private searchFieldExists(): boolean {
            if (document.getElementById("scextFieldSearch")) {
                return true;
            }
            return false;
        }

        private refreshSearchField(): void {
            if (!this.searchFieldExists()) {
                this.insertSearchField();
            }
        }

        initialize(): void {
            this.searchString = "";
            window.addEventListener('load', () => this.insertSearchField());
            this.addTreeNodeHandlers('scContentTree');
            HTMLHelpers.addProxy(scSitecore, 'postEvent', () => { this.refreshSearchField(); });
            HTMLHelpers.addProxy(scForm, 'invoke', () => { this.refreshSearchField(); });
        }
    }
}
