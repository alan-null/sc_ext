/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher {
    import SearchResult = Launcher.Models.SearchResult

    export class LauncherModule extends ModuleBase implements ISitecoreExtensionsModule {
        modalElement: HTMLDivElement;
        searchResultsElement: HTMLUListElement;
        searchBoxElement: HTMLInputElement;
        selectedCommand: NodeListOf<HTMLLIElement>;
        launcherOptions: any;
        commands: ICommand[];
        fuzzy: Libraries.Fuzzy

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
            this.commands = new Array<ICommand>();
            this.launcherOptions = {
                searchResultsCount: 8,
                shortcuts: {
                    show: 32,
                    hide: 27,
                    selectNextResult: 40,
                    selectPrevResult: 38,
                    executeCommand: 13
                }
            };

            this.registerModuleCommands();
            this.fuzzy = new Libraries.Fuzzy();
        }

        private registerModuleCommands(): void {
            this.registerProviderCommands(new Launcher.Providers.ContentEditorRibbonCommandsProvider());
            this.registerProviderCommands(new Launcher.Providers.AdminShortcutsCommandsProvider());
        }

        registerProviderCommands(provider: Providers.ICommandsProvider): void {
            this.registerCommands(provider.getCommands());
        }

        registerCommands(commands: ICommand[]): void {
            commands.forEach(cmd => { this.registerCommand(cmd); });
        }

        registerCommand(command: ICommand): void {
            command.id = this.commands.length + 1;
            this.commands.push(command);
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

        private appendResults(sortedResults: SearchResult[]): void {
            this.clearResults();
            if (sortedResults.length > 0) {
                for (var i = 0; i < sortedResults.length && i < this.launcherOptions.searchResultsCount; i++) {
                    var li = this.buildCommandHtml(sortedResults[i]);
                    this.searchResultsElement.appendChild(li);
                }

                if (this.searchResultsElement.className !== 'term-list') {
                    this.searchResultsElement.className = 'term-list';
                }
            }
        }

        clearResults(): void {
            this.searchResultsElement.className = 'term-list hidden';
            this.searchResultsElement.innerHTML = '';
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
                var element = <Element>e.srcElement;
                if (element.tagName != 'LI') {
                    element = <Element>element.parentNode;
                }
                this.changeSelectedCommand(element);
                this.searchBoxElement.focus();
            };
            li.ondblclick = _ => this.executeSelectedCommand();
            return li;
        }

        injectlauncherHtml(): void {
            var modal = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'launcher-modal', id: 'sc-ext-modal' });
            var div = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'launcher-modal-content' });
            var input = HTMLHelpers.createElement<HTMLInputElement>('input', { class: 'search-field', id: 'sc-ext-searchBox' });

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
                    case this.launcherOptions.shortcuts.show: {
                        if (evt.ctrlKey) {
                            this.showLauncher();
                            break;
                        }
                        return;
                    }
                    case this.launcherOptions.shortcuts.hide: {
                        if (event.target == this.searchBoxElement) {
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
                return evt.srcElement.id != 'sc-ext-searchBox';
            });
        }

        executeSelectedCommand(): void {
            var command = <ICommand>this.commands.find((cmd: ICommand) => {
                var selectedComandId = parseInt((<HTMLLIElement>this.selectedCommand[0]).dataset['id'])
                return cmd.id == selectedComandId
            });
            command.execute();
            this.hideLauncher()
        }

        inputKeyUpEvent(evt: KeyboardEvent): void {
            if (evt.keyCode == this.launcherOptions.shortcuts.executeCommand && this.selectedCommand[0]) {
                this.executeSelectedCommand();
                return;
            }
            if (evt.keyCode == this.launcherOptions.shortcuts.selectPrevResult || evt.keyCode == this.launcherOptions.shortcuts.selectNextResult) {
                this.commandSelectionEvent(evt);
            } else {
                var results = this.search(this.searchBoxElement.value);
                this.appendResults(results);

                if (this.searchResultsElement.children.length > 0) {
                    (<HTMLLIElement>this.searchResultsElement.firstChild).setAttribute('class', 'selected');
                }
            }
        }

        windowClickEvent(evt: MouseEvent): void {
            if (evt.target == this.modalElement) {
                this.modalElement.style.display = 'none';
                this.searchBoxElement.value = ''
            }
        }

        changeSelectedCommand(newSelected): void {
            var oldSelected = <HTMLLIElement>this.searchResultsElement.querySelector('.selected');
            oldSelected.removeAttribute('class');
            newSelected.setAttribute('class', 'selected');
        }

        commandSelectionEvent(evt: KeyboardEvent): void {
            var commands = this.searchResultsElement.querySelectorAll('li')
            if (commands.length > 0) {
                var selected = <HTMLLIElement>this.searchResultsElement.querySelector('.selected');
                if (selected == undefined) selected = <HTMLLIElement>this.searchResultsElement.querySelector('li')

                if (evt.keyCode == this.launcherOptions.shortcuts.selectPrevResult && commands[0] != selected) {
                    if (selected.className == 'selected') {
                        this.changeSelectedCommand(selected.previousSibling)
                    }
                }

                if (evt.keyCode == this.launcherOptions.shortcuts.selectNextResult && commands.length != 0) {
                    if (selected.className == 'selected' && commands[commands.length - 1] !== selected) {
                        this.changeSelectedCommand(selected.nextSibling)
                    }
                }
            }
        }

        private canBeExecuted(command: ICommand, index: number, array: ICommand[]): boolean {
            return command.canExecute();
        }

        private search(query: string): SearchResult[] {
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
                }
            }
            results.sort(this.fuzzy.matchComparator);
            return results.slice(0, this.launcherOptions.searchResultsCount);
        }

        canExecute(): boolean {
            return true && this.options.enabled;
        }

        initialize(): void {
            this.injectlauncherHtml();
            this.registerGlobalShortcuts();
            if (Context.Location() == Enums.Location.ContentEditor) {
                this.addFlowConditionForKeyDownEvent();
            }
            this.modalElement = <HTMLDivElement>document.getElementById('sc-ext-modal');
            this.searchBoxElement = <HTMLInputElement>document.getElementById('sc-ext-searchBox')
            this.searchResultsElement = <HTMLUListElement>document.getElementById('sc-ext-searchResults')
            this.selectedCommand = document.getElementsByClassName('selected') as NodeListOf<HTMLLIElement>;

            this.fuzzy.highlighting.before = "<span class='term'>";
            this.fuzzy.highlighting.after = '</span>';
        }
    }
}
