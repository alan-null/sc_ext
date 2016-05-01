/// <reference path="../../typings/es6-shim/es6-shim.d.ts"/>
'use strict';
declare var scExt: any;
declare var scSitecore: any;

namespace SitecoreExtensions.Modules {
    export interface ISitecoreExtensionsModule {
        moduleName: string;
        description: string;

        canExecute(): boolean;
        initialize(): void;
    }

    export class ModuleBase {
        moduleName: string;
        description: string;
        constructor(name: string, description: string) {
            this.moduleName = name;
            this.description = description;
        }
    }
}

namespace SitecoreExtensions.Modules.DatabaseName {
    export class DatabaseNameModule extends ModuleBase implements ISitecoreExtensionsModule {
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
}

namespace SitecoreExtensions.Modules.SectionSwitches {
    export class SectionSwitchesModule extends ModuleBase implements ISitecoreExtensionsModule {
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
            return true;
        }

        initialize(): void {
            window.addEventListener('load', () => this.insertButtons());
            this.addTreeNodeHandlers('scContentTree');
            scExt.htmlHelpers.addProxy(scSitecore, 'postEvent', () => {
                setTimeout(() => { this.refreshButtons(); }, 10);
            });
        }
    }

    import ICommandsProvider = SitecoreExtensions.Modules.Launcher.Providers.ICommandsProvider;
    import ICommand = SitecoreExtensions.Modules.Launcher.ICommand;
    export class SectionSwitchesCommandsProvider implements ICommandsProvider {
        commands: ICommand[];
        constructor() {
            this.commands = new Array<ICommand>();
            this.initCommands();
        }

        initCommands(): void {
            var cmd1: ICommand = {
                id: 0,
                name: 'Open sections',
                description: "Open all closed sections",
                execute: SectionSwitchesModule.prototype.openClosedSections,
                canExecute: () => { return true; }
            };
            var cmd2: ICommand = {
                id: 0,
                name: 'Close sections',
                description: "Close all opened sections",
                execute: SectionSwitchesModule.prototype.closeOpenedSections,
                canExecute: () => { return true; }
            };
            this.commands.push(cmd1);
            this.commands.push(cmd2);
        }

        getCommands(): ICommand[] {
            return this.commands;
        }
    }
}

namespace SitecoreExtensions.Modules.Launcher {
    export interface ICommand {
        id: number;
        name: string;
        description: string;
        execute: Function;
        canExecute: Function
    }

    export namespace Providers {
        declare var scForm: any;

        export interface ICommandsProvider {
            getCommands(): ICommand[]
        }

        export class ContentEditorRibbonCommandsprovider implements ICommandsProvider {
            commands: ICommand[];

            constructor() {
                this.commands = Array<ICommand>();
                this.enableStrips();
                this.createCommands();
            }
            getCommands(): ICommand[] {
                return this.commands;
            }

            createCommands(): void {
                this.addCommand('Save', 'Save any changes. (Ctrl+S)', () => { scForm.invoke('contenteditor:save', 'click'); }, () => { return true; })
                this.addCommand('Up', 'Go to the parent item.', () => { scForm.invoke('contenteditor:up', 'click'); }, () => { return true; })
                this.addCommand('Home', 'Go to your home item. (Ctrl+Shift+Home)', () => { scForm.invoke('contenteditor:home', 'click'); }, () => { return true; })
                this.addCommand('Search', 'Open the Search application. (Ctrl+Shift+F)', () => { scForm.invoke('shell:search', 'click'); }, () => { return true; })
                this.addCommand('Spelling', 'Run the spellcheck on all text and HTML fields in th selected item.', () => { scForm.invoke('contenteditor:spellcheck', 'click'); }, () => { return true; })
                this.addCommand('Markup', 'Send all HTML fields to the W3C HTML Validator.', () => { scForm.invoke('contenteditor:validatemarkup', 'click'); }, () => { return true; })
                this.addCommand('Validation', 'View the validation results. (F7)', () => { scForm.invoke('contenteditor:showvalidationresult', 'click'); }, () => { return true; })
                this.addCommand('My items', 'View the items you have locked.', () => { scForm.invoke('item:myitems', 'click'); }, () => { return true; })
                this.addCommand('Goals', 'Associate goals with the selected item.', () => { scForm.invoke('analytics:opengoals', 'click'); }, () => { return true; })
                this.addCommand('Attributes', 'Associate attributes to the selected item.', () => { scForm.invoke('analytics:opentrackingfield', 'click'); }, () => { return true; })
                this.addCommand('Details', 'View the attributes assigned to the selected item.', () => { scForm.invoke('analytics:viewtrackingdetails', 'click'); }, () => { return true; })
                this.addCommand('Page Analyzer', 'Page Analyzer', () => { scForm.invoke('pathanalyzer:open-page-analyzer', 'click'); }, () => { return true; })
                this.addCommand('Reports', 'Run an item report on the selected item.', () => { scForm.invoke('analytics:authoringfeedback', 'click'); }, () => { return true; })
                this.addCommand('Change', 'Set up the publishing settings.', () => { scForm.invoke('item:setpublishing', 'click'); }, () => { return true; })
                this.addCommand('Messages', 'Create, edit, and post a message on a target ntwork.', () => { scForm.invoke('social:dialog:show', 'click'); }, () => { return true; })
                this.addCommand('Reset', 'Reset the field values.', () => { scForm.invoke('item:resetfields', 'click'); }, () => { return true; })
                this.addCommand('Translate', 'Show the translate mode.', () => { scForm.invoke('Translate_Click', 'click'); }, () => { return true; })
                this.addCommand('Bucket', 'Convert this item into an ite bucket. (Ctrl+Shift+B)', () => { scForm.invoke('item:bucket', 'click'); }, () => { return true; })
                this.addCommand('Details', 'View and edit the layout details for the selected tem.', () => { scForm.invoke('item:setlayoutdetails', 'click'); }, () => { return true; })
                this.addCommand('Reset', 'Reset the layout details to the settings defined n the template level.', () => { scForm.invoke('pagedesigner:reset', 'click'); }, () => { return true; })
                this.addCommand('Preview', 'Preview of the selected item presentation.', () => { scForm.invoke('contenteditor:preview', 'click'); }, () => { return true; })
                this.addCommand('Screenshots', 'Take screenshots of your webpages.', () => { scForm.invoke('contenteditor:pagepreviews(width=90%,height=90%)', 'click'); }, () => { return true; })
                this.addCommand('Aliases', 'Assign URL aliases.', () => { scForm.invoke('item:setaliases', 'click'); }, () => { return true; })
                this.addCommand('Design', 'Set up the design of RSS feed for the selected item.', () => { scForm.invoke('item:setfeedpresentation', 'click'); }, () => { return true; })
                this.addCommand('Assign', 'Assign security rights for the selected item.', () => { scForm.invoke('item:openitemsecurityeditor', 'click'); }, () => { return true; })
                this.addCommand('Details', 'View assigned security rights for the selected item.', () => { scForm.invoke('contenteditor:opensecurity', 'click'); }, () => { return true; })
                this.addCommand('Change', 'Change of the ownership', () => { scForm.invoke('item:setowner', 'click'); }, () => { return true; })
                this.addCommand('Customize', 'Customize My Toolbar', () => { scForm.invoke('ribbon:customize', 'click'); }, () => { return true; })
                this.addCommand('Rebuild all', 'Rebuild all the indexes.', () => { scForm.invoke('indexing:rebuildall', 'click'); }, () => { return true; })
                this.addCommand('Re-Index Tree', 'Rebuild the index for this item and its desendants.', () => { scForm.invoke('indexing:refreshtree', 'click'); }, () => { return true; })

                this.addCommand('(1 of 3)Sample Item', 'Sample Item', () => { scForm.postEvent(this, 'click', 'item:addmaster(master={76036F5E-CBCE-46D1-AF0A-4143F9B557AA})'); }, () => { return true; });
                this.addCommand('(2 of 3)Folder', 'Folder', () => { scForm.postEvent(this, 'click', 'item:addmaster(master={A87A00B1-E6DB-45AB-8B54-636FEC3B5523})'); }, () => { return true; });
                this.addCommand('(3 of 3)Insert from template', 'Insert from template', () => { scForm.postEvent(this, 'click', 'item:addfromtemplate(id={110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9})'); }, () => { return true; });
                this.addCommand('Copy to', 'Copy the item to another location.', () => { scForm.postEvent(this, 'click', 'item:copyto'); }, () => { return true; });
                this.addCommand('Move to', 'Move the item to another location.', () => { scForm.postEvent(this, 'click', 'item:moveto'); }, () => { return true; });
                this.addCommand('Rename', 'Rename the item key. (F2)', () => { scForm.postEvent(this, 'click', 'item:rename'); }, () => { return true; });
                this.addCommand('Display name', 'Change the language-specific name.', () => { scForm.postEvent(this, 'click', 'item:setdisplayname'); }, () => { return true; });
                this.addCommand('Up', 'Move the item one step up in the Content Tree. (Ctrl+Shift+Alt+Up)', () => { scForm.postEvent(this, 'click', 'item:moveup'); }, () => { return true; });
                this.addCommand('Down', 'Move the item one step down in the Content Tree. (Ctrl+Shift+Alt+Down)', () => { scForm.postEvent(this, 'click', 'item:movedown'); }, () => { return true; });
                this.addCommand('First', 'Move the item to the first place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movefirst'); }, () => { return true; });
                this.addCommand('Last', 'Move the item to the last place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movelast'); }, () => { return true; });

                this.addCommand('Content tree', 'Show or hide the content tree.', () => { scForm.postEvent(this, 'click', 'javascript:scContent.toggleFolders()'); }, () => { return true; });
                this.addCommand('Entire tree', 'Show or hide all the sections in the content tree.', () => { scForm.postEvent(this, 'click', 'EntireTree_Click'); }, () => { return true; });
                this.addCommand('Hidden items', 'Show or hide items marked with the Hidden attribute.', () => { scForm.postEvent(this, 'click', 'HiddenItems_Click'); }, () => { return true; });
                this.addCommand('Standard fields', 'Show or hide fields from the Standard Template (system fields). (Ctrl+Shift+Alt+T)', () => { scForm.postEvent(this, 'click', 'StandardFields_Click'); }, () => { return true; });
                this.addCommand('Raw values', 'Show field values as input boxes or as raw values. (Ctrl+Shift+Alt+R)', () => { scForm.postEvent(document, 'click', 'RawValues_Click'); }, () => { return true; });
                this.addCommand('Buckets', 'Show or hide the bucket repository items', () => { scForm.postEvent(this, 'click', 'contenteditor:togglebucketitems'); }, () => { return true; });
            }

            enableStrips(): void {
                var strips = document.getElementsByClassName('scRibbonToolbarStrip');
                for (var index = 0; index < strips.length; index++) {
                    var strip = <HTMLBlockElement>strips[index];
                    var child = <HTMLDivElement>strip.firstChild;
                    if (child.tagName == "BLOCKQUOTE") {
                        var startComment = "<!--";
                        var endComment = "-->";
                        var html = child.innerHTML;

                        if (html.substring(0, startComment.length) === startComment && html.substring(html.length - endComment.length) === endComment) {
                            html = html.substring(startComment.length);
                            strip.innerHTML = html.substring(0, html.length - endComment.length);
                        }
                    }
                }
            }

            addCommand(name: string, description: string, execute: Function, canExecute: Function): void {
                var cmd: ICommand = {
                    id: 0,
                    name: name,
                    description: description,
                    execute: execute,
                    canExecute: canExecute
                };
                this.commands.push(cmd)
            }
        }
    }

    export class LauncherModule extends ModuleBase implements ISitecoreExtensionsModule {
        fuse: any;
        modalElement: HTMLDivElement;
        searchResultsElement: HTMLUListElement;
        searchBoxElement: HTMLInputElement;
        selectedCommand: NodeListOf<HTMLLIElement>;
        launcherOptions: any;
        commands: ICommand[];
        options: any;
        searchResults: any;

        constructor(name: string, description: string) {
            super(name, description);
            this.commands = new Array<ICommand>();
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

            this.registerModuleCommands();

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

        private registerModuleCommands(): void {
            this.registerProviderCommands(new Providers.ContentEditorRibbonCommandsprovider());
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

        appendResults(sortedResults: any[]): void {
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

        buildCommandHtml(command): HTMLLIElement {
            var li = scExt.htmlHelpers.createElement('li', { id: command.id });

            var spanName = scExt.htmlHelpers.createElement('span', { class: 'command-name' });
            spanName.innerText = command.name;
            var spanDescription = scExt.htmlHelpers.createElement('span', { class: 'command-description' });
            spanDescription.innerText = command.description;

            li.appendChild(spanName);
            li.appendChild(spanDescription);

            return li;
        }

        injectlauncherHtml(): void {
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
            scExt.htmlHelpers.addFlowConditionToEvent(scSitecore, 'onKeyDown', (evt: KeyboardEvent) => {
                evt = (evt != null ? evt : <KeyboardEvent>window.event);
                return evt.srcElement.id != "scESearchBox";
            });
        }

        inputKeyUpEvent(evt: KeyboardEvent): void {
            if (evt.keyCode == this.launcherOptions.shortcuts.executeCommand && this.selectedCommand[0]) {

                var command = <ICommand>this.commands.find((cmd: ICommand) => {
                    var selectedComandId = parseInt((<HTMLLIElement>this.selectedCommand[0]).id)
                    return cmd.id == selectedComandId
                });
                command.execute();
                this.hideLauncher()
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

        commandSelectionEvent(evt: KeyboardEvent): void {
            var commands = this.searchResultsElement.querySelectorAll('li')
            if (commands.length > 0) {
                var selected = <HTMLLIElement>this.searchResultsElement.querySelector('.selected');
                if (selected == undefined) selected = <HTMLLIElement>this.searchResultsElement.querySelector('li')

                if (evt.keyCode == this.launcherOptions.shortcuts.selectPrevResult && commands[0] != selected) {
                    if (selected.className == 'selected') {
                        selected.removeAttribute('class');
                        (<HTMLLIElement>selected.previousSibling).setAttribute('class', 'selected');
                    } else {
                        selected.setAttribute('class', 'selected');
                    }
                }

                if (evt.keyCode == this.launcherOptions.shortcuts.selectNextResult && commands.length != 0) {
                    if (selected.className == 'selected' && commands[commands.length - 1] !== selected) {
                        selected.removeAttribute('class');
                        (<HTMLLIElement>selected.nextSibling).setAttribute('class', 'selected');
                    } else {
                        selected.setAttribute('class', 'selected');
                    }
                }
            }
        }

        search(phrase: string): any[] {
            if (this.fuse == undefined) {
                this.fuse = new scExt.libraries.Fuse(this.commands, this.options);
            }
            return this.fuse.search(phrase);
        }

        canExecute(): boolean {
            return true;
        }

        initialize(): void {
            this.injectlauncherHtml();
            this.registerGlobalShortcuts();
            this.addFlowConditionForKeyDownEvent();
            this.modalElement = <HTMLDivElement>document.getElementById('myModal');
            this.searchBoxElement = <HTMLInputElement>document.getElementById('scESearchBox')
            this.searchResultsElement = <HTMLUListElement>document.getElementById('searchResults')
            this.selectedCommand = document.getElementsByClassName('selected') as NodeListOf<HTMLLIElement>;
        }
    }
}

namespace SitecoreExtensions {
    import ISitecoreExtensionsModule = SitecoreExtensions.Modules.ISitecoreExtensionsModule;
    export class ExtensionsManager {
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
}


var scExtManager = new SitecoreExtensions.ExtensionsManager();
var sectionSwitchesModule = new SitecoreExtensions.Modules.SectionSwitches.SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click');
var dbNameModule = new SitecoreExtensions.Modules.DatabaseName.DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header');
var launcher = new SitecoreExtensions.Modules.Launcher.LauncherModule('Launcher', 'Feel like power user using Sitecore Extensions command launcher.');

scExtManager.addModule(sectionSwitchesModule);
scExtManager.addModule(dbNameModule);
scExtManager.addModule(launcher);

scExtManager.initModules();


launcher.registerProviderCommands(new SitecoreExtensions.Modules.SectionSwitches.SectionSwitchesCommandsProvider())