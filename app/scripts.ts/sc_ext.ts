'use strict';
declare var scExt: any;
declare var scSitecore: any;

interface ISitecoreExtensionsModule {
    moduleName: string;
    description: string;

    canExecute(): boolean;
    initialize(): void;
}

class BaseModule {
    moduleName: string;
    description: string;
    constructor(name: string, description: string) {
        this.moduleName = name;
        this.description = description;
    }
}

class DatabaseNameModule extends BaseModule implements ISitecoreExtensionsModule {
    constructor(name: string, description: string) {
        super(name, description);
    }

    getDbName(): string {
        var element = <HTMLInputElement>document.querySelector('#__CurrentItem');
        return element.value.split('/').slice(2, 3)[0];
    }
    adDbNameToHeader(dbName: string): void {
        var dbnameDiv = scExt.htmlHelpers.createElement('div', { class: 'sc-globalHeader-loginInfo' })
        dbnameDiv.innerText = dbName;
        var startButton = document.querySelector('.sc-globalHeader-content .col2');
        startButton.insertBefore(dbnameDiv, startButton.firstChild);
    }

    canExecute(): boolean {
        return true;
    }

    initialize(): void {
        this.adDbNameToHeader(this.getDbName().toUpperCase());
    }
}

class SectionSwitchesModule extends BaseModule implements ISitecoreExtensionsModule {
    sectionSwitchButtonClassName: string;
    constructor(name: string, description: string) {
        super(name, description);
        this.sectionSwitchButtonClassName = 'scEButton';
    }

    closeOpenedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
    };

    openClosedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
    };

    createTabControlButton(text: string, callback: Function): HTMLAnchorElement {
        var span = scExt.htmlHelpers.createElement('span', {});
        span.innerText = text
        var link = scExt.htmlHelpers.createElement('a', {
            href: '#',
            class: 'scEditorHeaderNavigator scEditorHeaderButton scButton ' + this.sectionSwitchButtonClassName
        });
        link.onclick = callback
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
        if (() => !this.buttonsExists()) {
            this.insertButtons();
        }
    }

    addTreeNodeHandlers(className: string): void {
        var nodes = document.getElementsByClassName(className);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', function (evt) {
                setTimeout(() => {
                    this.refreshButtons();
                }, 10);
            });
        }
    }

    canExecute(): boolean {
        return true;
    }

    initialize(): void {
        window.addEventListener('load', () => this.insertButtons());
        this.addTreeNodeHandlers('scContentTree');
        scExt.htmlHelpers.addProxy(scSitecore, 'postEvent', () => setTimeout(this.refreshButtons, 10)
        )
    }
}

class LauncherModule extends BaseModule implements ISitecoreExtensionsModule {
    fuse: any;
    modalElement: any;
    searchResultsElement: any;
    searchBoxElement: any;
    selectedCommand: any;
    launcherOptions: any;
    fuseDatasource: any;
    options: any;
    launcherControl: any;
    searchResults: any;

    constructor(name: string, description: string) {
        super(name, description);
        this.launcherOptions = {
            searchResultsCount: 5,
            shortcuts: {
                show: 32,
                hide: 27,
                selectNextResult: 40,
                selectPrevResult: 38,
                executeCommand: 13
            }
        };

        this.fuseDatasource = {
            commands: (function () {
                return [
                    {
                        id: 1,
                        name: 'Close sections',
                        description: 'Close all opened sections',
                        command: {
                            callback: function () {
                                scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
                            },
                            shortcut: ''
                        }
                    },
                    {
                        id: 2,
                        name: 'Open sections',
                        description: 'Open all closed sections',
                        command: {
                            callback: function () {
                                scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
                            },
                            shortcut: ''
                        }
                    }
                ];
            })()
        }


        this.options = {
            caseSensitive: false,
            includeScore: false,
            shouldSort: true,
            tokenize: false,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            keys: ['name'],
            // verbose: true
        };


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

    appendResults(sortedResults): void {
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

    buildCommandHtml(command) {
        var li = scExt.htmlHelpers.createElement('li', { id: command.id });

        var spanName = scExt.htmlHelpers.createElement('span', { class: 'command-name' });
        spanName.innerText = command.name;
        var spanDescription = scExt.htmlHelpers.createElement('span', { class: 'command-description' });
        spanDescription.innerText = command.description;

        li.appendChild(spanName);
        li.appendChild(spanDescription);

        return li;
    }

    injectlauncherHtml() {
        var modal = scExt.htmlHelpers.createElement('div', { class: 'modal', id: 'myModal' });
        var div = scExt.htmlHelpers.createElement('div', { class: 'modal-content' });
        var input = scExt.htmlHelpers.createElement('input', { class: 'search-field', id: 'scESearchBox' })

        var ul = scExt.htmlHelpers.createElement('ul', { class: 'term-list hidden', id: 'searchResults' })
        input.onkeyup = (e) => this.inputKeyUpEvent(e);
        div.appendChild(input);
        div.appendChild(ul);
        window.onclick = (e) => this.windowClickEvent(e);
        modal.appendChild(div);
        document.getElementById('Body').appendChild(modal);
    }

    registerGlobalShortcuts() {
        document.onkeydown = (e) => {
            // e = e || window.event;
            switch (e.which || e.keyCode) {
                case this.launcherOptions.shortcuts.show: {
                    if (e.ctrlKey) {
                        this.showLauncher();
                    }
                    break;
                }
                case this.launcherOptions.shortcuts.hide: {
                    if (event.target == this.searchBoxElement) {
                        this.hideLauncher();
                    }
                    break;
                }
                default: return;
            }
            e.preventDefault();
        };
    }

    inputKeyUpEvent(evt) {
        if (evt.keyCode == this.launcherOptions.shortcuts.executeCommand && this.selectedCommand[0]) {
            var command = this.fuseDatasource.commands.find((e) => {
                return e.id == this.selectedCommand[0].id
            });
            console.log(command);
            command.command.callback();
            this.hideLauncher()
            return;
        }
        if (evt.keyCode == this.launcherOptions.shortcuts.selectPrevResult || evt.keyCode == this.launcherOptions.shortcuts.selectNextResult) {
            this.commandSelectionEvent(evt);
        } else {
            var results = this.search(this.searchBoxElement.value);
            console.log(results);

            this.appendResults(results);

            if (this.searchResultsElement.children.length > 0) {
                this.searchResultsElement.firstChild.setAttribute('class', 'selected');
            }
        }
    }

    windowClickEvent(event) {
        if (event.target == this.modalElement) {
            this.modalElement.style.display = 'none';
            this.searchBoxElement.value = ''
        }
    }

    commandSelectionEvent(evt) {
        var commands = this.searchResultsElement.querySelectorAll('li')
        if (commands.length > 0) {
            var selected = this.searchResultsElement.querySelector('.selected')
            if (selected == undefined) selected = this.searchResultsElement.querySelector('li')

            if (evt.keyCode == this.launcherOptions.shortcuts.selectPrevResult && commands[0] != selected) {
                if (selected.className == 'selected') {
                    selected.removeAttribute('class')
                    selected.previousSibling.setAttribute('class', 'selected');
                } else {
                    selected.setAttribute('class', 'selected');
                }
            }

            if (evt.keyCode == this.launcherOptions.shortcuts.selectNextResult && commands.length != 0) {
                if (selected.className == 'selected' && commands[commands.length - 1] !== selected) {
                    selected.removeAttribute('class')
                    selected.nextSibling.setAttribute('class', 'selected');
                } else {
                    selected.setAttribute('class', 'selected');
                }
            }
        }
    }

    search(phrase) {
        if (this.fuse == undefined) {
            this.fuse = new scExt.libraries.Fuse(this.fuseDatasource.commands, this.options);
        }
        return this.fuse.search(phrase);
    }


    canExecute(): boolean {
        return true;
    }

    initialize(): void {
        this.injectlauncherHtml();
        this.registerGlobalShortcuts();
        this.modalElement = document.getElementById('myModal');
        this.searchBoxElement = document.getElementById('scESearchBox')
        this.searchResultsElement = document.getElementById('searchResults')
        this.selectedCommand = document.getElementsByClassName('selected')
    }
}

class SitecoreExtensions {
    modules: ISitecoreExtensionsModule[];
    constructor() {
        this.modules = new Array<ISitecoreExtensionsModule>();
    }

    addModule(module: ISitecoreExtensionsModule): void {
        this.modules.push(module);
    }

    initModules(): void {
        this.modules.forEach(m => {
            if (m.canExecute()) {
                m.initialize();
            }
        });
    }

    getModule(type: any): ISitecoreExtensionsModule {
        for (var index = 0; index < this.modules.length; index++) {
            var m = this.modules[index];
            if (m.constructor === type) {
                return m;
            }
        }
        return null;
    }
}

var sce = new SitecoreExtensions();
sce.addModule(new DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header'));
sce.addModule(new SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click'));
sce.addModule(new LauncherModule('Launcher', 'Feel like power user using Sitecore Extensions command launcher.'));
sce.initModules();