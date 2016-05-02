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
            this.adDbNameToHeader(SitecoreExtensions.Context.Database().toUpperCase());
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
                this.createCommands();
            }
            getCommands(): ICommand[] {
                return this.commands;
            }

            createCommands(): void {
                //Home
                this.addCommand('Save', 'Save any changes. (Ctrl+S)', () => { scForm.invoke('contenteditor:save', 'click'); }, () => { return true; })
                this.addCommand('Edit', 'Lock or unlock the item for editing. (F8)', () => { scForm.invoke('contenteditor:edit'); }, () => { return true; })
                this.addCommand('Insert from template', 'Insert from template', () => { scForm.postEvent(this, 'click', 'item:addfromtemplate(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; });
                this.addCommand('Duplicate item', 'Duplicate item', () => { scForm.postEvent(this, 'click', 'item:duplicate'); }, () => { return true; })
                this.addCommand('Clone item', 'Clone item', () => { scForm.postEvent(this, 'click', 'item:clone'); }, () => { return true; })
                this.addCommand('Copy to', 'Copy the item to another location.', () => { scForm.postEvent(this, 'click', 'item:copyto'); }, () => { return true; });
                this.addCommand('Move to', 'Move the item to another location.', () => { scForm.postEvent(this, 'click', 'item:moveto'); }, () => { return true; });
                this.addCommand('Delete', 'Delete the item.', () => { scForm.invoke('item:delete(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; })
                this.addCommand('Delete subitems', 'Delete current item subitems.', () => { scForm.postEvent(this, 'click', 'item:deletechildren(id=)'); }, () => { return true; });
                this.addCommand('Rename', 'Rename the item key. (F2)', () => { scForm.postEvent(this, 'click', 'item:rename'); }, () => { return true; });
                this.addCommand('Display name', 'Change the language-specific name.', () => { scForm.postEvent(this, 'click', 'item:setdisplayname'); }, () => { return true; });
                this.addCommand('Up', 'Move the item one step up in the Content Tree. (Ctrl+Shift+Alt+Up)', () => { scForm.postEvent(this, 'click', 'item:moveup'); }, () => { return true; });
                this.addCommand('Down', 'Move the item one step down in the Content Tree. (Ctrl+Shift+Alt+Down)', () => { scForm.postEvent(this, 'click', 'item:movedown'); }, () => { return true; });
                this.addCommand('First', 'Move the item to the first place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movefirst'); }, () => { return true; });
                this.addCommand('Last', 'Move the item to the last place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movelast'); }, () => { return true; });

                //Navigate
                this.addCommand('Open', 'Open an item.', () => { scForm.invoke('item:open'); }, () => { return true; });
                this.addCommand('Back', 'Go to the previously selected item.', () => { scForm.invoke('contenteditor:back', 'click'); }, () => { return true; })
                this.addCommand('Up', 'Go to the parent item.', () => { scForm.invoke('contenteditor:up', 'click'); }, () => { return true; })
                this.addCommand('Home', 'Go to your home item. (Ctrl+Shift+Home)', () => { scForm.invoke('contenteditor:home', 'click'); }, () => { return true; })
                this.addCommand('Add to favorites', 'Add current item to favourites', () => { scForm.postEvent(this, 'click', 'favorites:add(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; });
                this.addCommand('Organize', 'Organize favorites', () => { scForm.postEvent(this, 'click', 'favorites:organize'); }, () => { return true; });
                this.addCommand('Search', 'Open the Search application. (Ctrl+Shift+F)', () => { scForm.invoke('shell:search', 'click'); }, () => { return true; })

                //Review
                this.addCommand('Spelling', 'Run the spellcheck on all text and HTML fields in th selected item.', () => { scForm.invoke('contenteditor:spellcheck', 'click'); }, () => { return true; })
                this.addCommand('Markup', 'Send all HTML fields to the W3C HTML Validator.', () => { scForm.invoke('contenteditor:validatemarkup', 'click'); }, () => { return true; })
                this.addCommand('Validation', 'View the validation results. (F7)', () => { scForm.invoke('contenteditor:showvalidationresult', 'click'); }, () => { return true; })
                this.addCommand('My items', 'View the items you have locked.', () => { scForm.invoke('item:myitems', 'click'); }, () => { return true; })
                this.addCommand("Set reminder", 'Set reminder', () => { scForm.postEvent(this, 'click', 'item:reminderset(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; })
                this.addCommand("Clear reminder", 'Clear reminder', () => { scForm.postEvent(this, 'click', 'item:reminderclear(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; })
                this.addCommand("Archive item now", 'Archive item now', () => { scForm.postEvent(this, 'click', 'item:archiveitem(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; })
                this.addCommand("Archive version now", 'Archive version now', () => { scForm.postEvent(this, 'click', 'item:archiveversion(id=' + SitecoreExtensions.Context.ItemID() + ', la=en, vs=1)'); }, () => { return true; })
                this.addCommand("Set archive date", 'Set archive date', () => { scForm.postEvent(this, 'click', 'item:archivedateset(id=' + SitecoreExtensions.Context.ItemID() + ')'); }, () => { return true; })

                //Analyze
                this.addCommand('Goals', 'Associate goals with the selected item.', () => { scForm.invoke('analytics:opengoals', 'click'); }, () => { return true; })
                this.addCommand('Attributes', 'Associate attributes to the selected item.', () => { scForm.invoke('analytics:opentrackingfield', 'click'); }, () => { return true; })
                this.addCommand('Details', 'View the attributes assigned to the selected item.', () => { scForm.invoke('analytics:viewtrackingdetails', 'click'); }, () => { return true; })
                this.addCommand('Page Analyzer', 'Page Analyzer', () => { scForm.invoke('pathanalyzer:open-page-analyzer', 'click'); }, () => { return true; })
                this.addCommand('Reports', 'Run an item report on the selected item.', () => { scForm.invoke('analytics:authoringfeedback', 'click'); }, () => { return true; })

                //Publish
                this.addCommand('Change', 'Set up the publishing settings.', () => { scForm.invoke('item:setpublishing', 'click'); }, () => { return true; })
                this.addCommand('Publish', 'Publish the item in all languages to all publishing targets.', () => { scForm.invoke('item:publishnow(related=1,subitems=0,smart=1)'); }, () => { return true; })
                this.addCommand('Publish item', 'Publish item', () => { scForm.postEvent(this, 'click', 'item:publish(id=)'); }, () => { return true; })
                this.addCommand('Publish site', 'Publish site', () => { scForm.postEvent(this, 'click', 'system:publish'); }, () => { return true; })
                this.addCommand('Experience Editor', 'Start the Experience Editor.', () => { scForm.postEvent(this, 'click', 'webedit:openexperienceeditor'); }, () => { return true; })
                this.addCommand('Preview', 'Start the Preview mode.', () => { scForm.postEvent(this, 'click', 'item:preview'); }, () => { return true; })
                this.addCommand('Publishing viewer', 'View the publishing dates of each version.', () => { scForm.postEvent(this, 'click', 'item:publishingviewer(id=)'); }, () => { return true; })
                this.addCommand('Messages', 'Create, edit, and post a message on a target ntwork.', () => { scForm.invoke('social:dialog:show', 'click'); }, () => { return true; })

                //Versions
                this.addCommand('Reset', 'Reset the field values.', () => { scForm.invoke('item:resetfields', 'click'); }, () => { return true; })
                this.addCommand('Add', 'Add a version of the selected item.', () => { scForm.postEvent(this, 'click', 'item:addversion(id=)'); }, () => { return true; })
                this.addCommand('Compare', 'Compare the versions of the selected item.', () => { scForm.postEvent(this, 'click', 'item:compareversions'); }, () => { return true; })
                this.addCommand('Remove', 'Remove the item version that is currently displayed.', () => { scForm.postEvent(this, 'click', 'item:deleteversion'); }, () => { return true; })
                this.addCommand('Remove all versions', 'Remove all versions', () => { scForm.postEvent(this, 'click', 'item:removelanguage'); }, () => { return true; })
                this.addCommand('Translate', 'Show the translate mode.', () => { scForm.invoke('Translate_Click', 'click'); }, () => { return true; })

                //Configure
                this.addCommand('Help', 'Write help texts.', () => { scForm.postEvent(this, 'click', 'item:sethelp'); }, () => { return true; })
                this.addCommand('Editors', 'Configure the custom editors.', () => { scForm.postEvent(this, 'click', 'item:setcustomeditors'); }, () => { return true; })
                this.addCommand('Tree node style', 'Define the appearance in the content tree.', () => { scForm.postEvent(this, 'click', 'item:settreenodestyle'); }, () => { return true; })
                this.addCommand('Contextual tab', 'Specify a contextual tab in the ribbon.', () => { scForm.postEvent(this, 'click', 'item:setribbon'); }, () => { return true; })
                this.addCommand('Context menu', 'Specify the context menu.', () => { scForm.postEvent(this, 'click', 'item:setcontextmenu'); }, () => { return true; })
                this.addCommand('Bucket', 'Convert this item into an ite bucket. (Ctrl+Shift+B)', () => { scForm.invoke('item:bucket', 'click'); }, () => { return true; })
                this.addCommand('Revert', 'Revert this item bucket to a normal folder. (Ctrl+Shift+D)', () => { scForm.invoke('item:unbucket', 'click'); }, () => { return true; })
                this.addCommand('Sync', 'Synchronize this item bucket. (Ctrl+Shift+U)', () => { scForm.invoke('item:syncbucket', 'click'); }, () => { return true; })
                this.addCommand('Bucketable:Current item', 'Allow the current item to be stored as an unstructured item in an item bucket.', () => { scForm.postEvent(this, 'click', 'item:bucketable'); }, () => { return true; })
                this.addCommand('Bucketable:Standard values', 'Allow every item based on the Sample Item template to be stored as an unstructured item in an item bucket.', () => { scForm.postEvent(this, 'click', 'template:bucketable'); }, () => { return true; })
                this.addCommand('Assign', 'Assign insert options', () => { scForm.postEvent(this, 'click', 'item:setmasters'); }, () => { return true; })
                this.addCommand('Reset', 'Reset to the insert options defined on the template.', () => { scForm.postEvent(this, 'click', 'masters:reset'); }, () => { return true; })
                this.addCommand('Change', 'Change to another template.', () => { scForm.postEvent(this, 'click', 'item:changetemplate'); }, () => { return true; })
                this.addCommand('Edit', 'Open the Template Editor.', () => { scForm.postEvent(this, 'click', 'shell:edittemplate'); }, () => { return true; })
                this.addCommand('Hide Item', 'Mark the item as hidden or visible.', () => { scForm.postEvent(this, 'click', 'item:togglehidden'); }, () => { return true; })
                this.addCommand('Protect Item', 'Protect or unprotect the item from changes. (Ctrl+Shift+Alt+L)', () => { scForm.postEvent(this, 'click', 'item:togglereadonly'); }, () => { return true; })

                //Presentation
                this.addCommand('Details', 'View and edit the layout details for the selected tem.', () => { scForm.invoke('item:setlayoutdetails', 'click'); }, () => { return true; })
                this.addCommand('Reset', 'Reset the layout details to the settings defined n the template level.', () => { scForm.invoke('pagedesigner:reset', 'click'); }, () => { return true; })
                this.addCommand('Preview', 'Preview of the selected item presentation.', () => { scForm.invoke('contenteditor:preview', 'click'); }, () => { return true; })
                this.addCommand('Screenshots', 'Take screenshots of your webpages.', () => { scForm.invoke('contenteditor:pagepreviews(width=90%,height=90%)', 'click'); }, () => { return true; })
                this.addCommand('Aliases', 'Assign URL aliases.', () => { scForm.invoke('item:setaliases', 'click'); }, () => { return true; })
                this.addCommand('Design', 'Set up the design of RSS feed for the selected item.', () => { scForm.invoke('item:setfeedpresentation', 'click'); }, () => { return true; })

                //Security
                this.addCommand('Remove Inherit', 'Security Preset: Remove Inherit', () => { scForm.invoke('item:securitypreset(preset={74A590B5-CC32-4777-8ADE-7369C753B7FF})'); }, () => { return true; })
                this.addCommand('Require Login', 'Security Preset: Require Login', () => { scForm.invoke('item:securitypreset(preset={506FC890-44A4-4037-8696-4934CB75C00A})'); }, () => { return true; })
                this.addCommand('Assign', 'Assign security rights for the selected item.', () => { scForm.invoke('item:openitemsecurityeditor', 'click'); }, () => { return true; })
                this.addCommand('Details', 'View assigned security rights for the selected item.', () => { scForm.invoke('contenteditor:opensecurity', 'click'); }, () => { return true; })
                this.addCommand('Change', 'Change of the ownership', () => { scForm.invoke('item:setowner', 'click'); }, () => { return true; })
                this.addCommand('Access Viewer', 'Open the Access Viewer.', () => { scForm.postEvent(this, 'click', 'shell:accessviewer'); }, () => { return true; })
                this.addCommand('User Manager', 'Open the User Manager.', () => { scForm.postEvent(this, 'click', 'shell:usermanager'); }, () => { return true; })

                //View
                this.addCommand('Content tree', 'Show or hide the content tree.', () => { scForm.postEvent(this, 'click', 'javascript:scContent.toggleFolders()'); }, () => { return true; });
                this.addCommand('Entire tree', 'Show or hide all the sections in the content tree.', () => { scForm.postEvent(this, 'click', 'EntireTree_Click'); }, () => { return true; });
                this.addCommand('Hidden items', 'Show or hide items marked with the Hidden attribute.', () => { scForm.postEvent(this, 'click', 'HiddenItems_Click'); }, () => { return true; });
                this.addCommand('Standard fields', 'Show or hide fields from the Standard Template (system fields). (Ctrl+Shift+Alt+T)', () => { scForm.postEvent(this, 'click', 'StandardFields_Click'); }, () => { return true; });
                this.addCommand('Raw values', 'Show field values as input boxes or as raw values. (Ctrl+Shift+Alt+R)', () => { scForm.postEvent(document, 'click', 'RawValues_Click'); }, () => { return true; });
                this.addCommand('Buckets', 'Show or hide the bucket repository items', () => { scForm.postEvent(this, 'click', 'contenteditor:togglebucketitems'); }, () => { return true; });

                //My Toolbar                
                this.addCommand('Customize', 'Customize My Toolbar', () => { scForm.invoke('ribbon:customize', 'click'); }, () => { return true; })

                //Developer
                this.addCommand('Create', 'Create a new template', () => { scForm.postEvent(this, 'click', 'templates:new'); }, () => { return true; })
                this.addCommand('Branch', 'Go to the first branch', () => { scForm.postEvent(this, 'click', 'item:gotomaster'); }, () => { return true; })
                this.addCommand('Template', 'Go to the template', () => { scForm.postEvent(this, 'click', 'item:gototemplate'); }, () => { return true; })
                this.addCommand('Serialize item', 'Serialize the item to the file system', () => { scForm.postEvent(this, 'click', 'itemsync:dumpitem'); }, () => { return true; })
                this.addCommand('Serialize tree', 'Serialize the item and subitems to the file system', () => { scForm.postEvent(this, 'click', 'itemsync:dumptree'); }, () => { return true; })
                this.addCommand('Update item', 'Update the item from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaditem'); }, () => { return true; })
                this.addCommand('Revert item', 'Revert the item from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaditem(revert=1)'); }, () => { return true; })
                this.addCommand('Update tree', 'Update the item and subitems from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loadtree'); }, () => { return true; })
                this.addCommand('Revert tree', 'Revert the item and subitems from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loadtree(revert=1)'); }, () => { return true; })
                this.addCommand('Update database', 'Update the database from the file system. Not removing local modifications', () => { scForm.postEvent(this, 'click', 'itemsync:loaddatabase'); }, () => { return true; })
                this.addCommand('Revert database', 'Revert the database from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaddatabase(revert=1)'); }, () => { return true; })
                this.addCommand('Rebuild all', 'Rebuild all the indexes.', () => { scForm.invoke('indexing:rebuildall', 'click'); }, () => { return true; })
                this.addCommand('Re-Index Tree', 'Rebuild the index for this item and its desendants.', () => { scForm.invoke('indexing:refreshtree', 'click'); }, () => { return true; })
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
                keys: ['name', 'description'],
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

    export class Context {
        database: string;
        itemID: string;
        constructor() { }

        static GetCurrentItem(): string {
            var element = <HTMLInputElement>document.querySelector('#__CurrentItem');
            return element.value;
        }

        static Database(): string {
            var value = this.GetCurrentItem();
            return value.split('/').slice(2, 3)[0];
        }

        static ItemID(): string {
            var value = this.GetCurrentItem();
            return value.match(/{.*}/)[0];
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