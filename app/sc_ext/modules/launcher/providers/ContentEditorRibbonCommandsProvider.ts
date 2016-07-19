/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export class ContentEditorRibbonCommandsProvider implements ICommandsProvider {
        commands: ICommand[];

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }
        getCommands(): ICommand[] {
            return this.commands;
        }

        createCommands(): void {
            var canExecute = () => { return Context.Location() == Enums.Location.ContentEditor; }

            //Home
            this.addCommand('Save', 'Save any changes. (Ctrl+S)', () => { scForm.invoke('contenteditor:save', 'click'); }, canExecute)
            this.addCommand('Edit', 'Lock or unlock the item for editing. (F8)', () => { scForm.invoke('contenteditor:edit'); }, canExecute)
            this.addCommand('Insert from template', 'Insert from template', () => { scForm.postEvent(this, 'click', 'item:addfromtemplate(id=' + Context.ItemID() + ')'); }, canExecute);
            this.addCommand('Duplicate item', 'Duplicate item', () => { scForm.postEvent(this, 'click', 'item:duplicate'); }, canExecute)
            this.addCommand('Clone item', 'Clone item', () => { scForm.postEvent(this, 'click', 'item:clone'); }, canExecute)
            this.addCommand('Copy to', 'Copy the item to another location.', () => { scForm.postEvent(this, 'click', 'item:copyto'); }, canExecute);
            this.addCommand('Move to', 'Move the item to another location.', () => { scForm.postEvent(this, 'click', 'item:moveto'); }, canExecute);
            this.addCommand('Delete', 'Delete the item.', () => { scForm.invoke('item:delete(id=' + Context.ItemID() + ')'); }, canExecute)
            this.addCommand('Delete children', 'Delete current item subitems.', () => { scForm.postEvent(this, 'click', 'item:deletechildren(id=)'); }, canExecute);
            this.addCommand('Rename', 'Rename the item key. (F2)', () => { scForm.postEvent(this, 'click', 'item:rename'); }, canExecute);
            this.addCommand('Display name', 'Change the language-specific name.', () => { scForm.postEvent(this, 'click', 'item:setdisplayname'); }, canExecute);
            this.addCommand('Move Up', 'Move the item one step up in the Content Tree. (Ctrl+Shift+Alt+Up)', () => { scForm.postEvent(this, 'click', 'item:moveup'); }, canExecute);
            this.addCommand('Move Down', 'Move the item one step down in the Content Tree. (Ctrl+Shift+Alt+Down)', () => { scForm.postEvent(this, 'click', 'item:movedown'); }, canExecute);
            this.addCommand('Move First', 'Move the item to the first place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movefirst'); }, canExecute);
            this.addCommand('Move Last', 'Move the item to the last place at this level in the Content Tree.', () => { scForm.postEvent(this, 'click', 'item:movelast'); }, canExecute);

            //Navigate
            this.addCommand('Open', 'Open an item.', () => { scForm.invoke('item:open'); }, canExecute);
            this.addCommand('Navigate: Back', 'Go to the previously selected item.', () => { scForm.invoke('contenteditor:back', 'click'); }, canExecute)
            this.addCommand('Navigate: Forward', 'Go to the next selected item.', () => { scForm.invoke('contenteditor:forward', 'click'); }, canExecute)
            this.addCommand('Navigate: Up', 'Go to the parent item.', () => { scForm.invoke('contenteditor:up', 'click'); }, canExecute)
            this.addCommand('Navigate: Home', 'Go to your home item. (Ctrl+Shift+Home)', () => { scForm.invoke('contenteditor:home', 'click'); }, canExecute)
            this.addCommand('Add to favorites', 'Add current item to favourites', () => { scForm.postEvent(this, 'click', 'favorites:add(id=' + Context.ItemID() + ')'); }, canExecute);
            this.addCommand('Organize', 'Organize favorites', () => { scForm.postEvent(this, 'click', 'favorites:organize'); }, canExecute);
            this.addCommand('Search', 'Open the Search application. (Ctrl+Shift+F)', () => { scForm.invoke('shell:search', 'click'); }, canExecute)

            //Review
            this.addCommand('Spellcheck', 'Run the spellcheck on all text and HTML fields in th selected item.', () => { scForm.invoke('contenteditor:spellcheck', 'click'); }, canExecute)
            this.addCommand('Validate Markup', 'Send all HTML fields to the W3C HTML Validator.', () => { scForm.invoke('contenteditor:validatemarkup', 'click'); }, canExecute)
            this.addCommand('Validation', 'View the validation results. (F7)', () => { scForm.invoke('contenteditor:showvalidationresult', 'click'); }, canExecute)
            this.addCommand('My items', 'View the items you have locked.', () => { scForm.invoke('item:myitems', 'click'); }, canExecute)
            this.addCommand('Set reminder', 'Set reminder', () => { scForm.postEvent(this, 'click', 'item:reminderset(id=' + Context.ItemID() + ')'); }, canExecute)
            this.addCommand('Clear reminder', 'Clear reminder', () => { scForm.postEvent(this, 'click', 'item:reminderclear(id=' + Context.ItemID() + ')'); }, canExecute)
            this.addCommand('Archive item now', 'Archive item now', () => { scForm.postEvent(this, 'click', 'item:archiveitem(id=' + Context.ItemID() + ')'); }, canExecute)
            this.addCommand('Archive version now', 'Archive version now', () => { scForm.postEvent(this, 'click', 'item:archiveversion(id=' + Context.ItemID() + ', la=en, vs=1)'); }, canExecute)
            this.addCommand('Set archive date', 'Set archive date', () => { scForm.postEvent(this, 'click', 'item:archivedateset(id=' + Context.ItemID() + ')'); }, canExecute)

            //Analyze
            this.addCommand('Goals', 'Associate goals with the selected item.', () => { scForm.invoke('analytics:opengoals', 'click'); }, canExecute)
            this.addCommand('Attributes', 'Associate attributes to the selected item.', () => { scForm.invoke('analytics:opentrackingfield', 'click'); }, canExecute)
            this.addCommand('Tracking Details', 'View the attributes assigned to the selected item.', () => { scForm.invoke('analytics:viewtrackingdetails', 'click'); }, canExecute)
            this.addCommand('Page Analyzer', 'Page Analyzer', () => { scForm.invoke('pathanalyzer:open-page-analyzer', 'click'); }, canExecute)
            this.addCommand('Reports', 'Run an item report on the selected item.', () => { scForm.invoke('analytics:authoringfeedback', 'click'); }, canExecute)

            //Publish
            this.addCommand('Change Publishing Settings', 'Set up the publishing settings.', () => { scForm.invoke('item:setpublishing', 'click'); }, canExecute)
            this.addCommand('Publish Now', 'Publish the item in all languages to all publishing targets.', () => { scForm.invoke('item:publishnow(related=1,subitems=0,smart=1)'); }, canExecute)
            this.addCommand('Publish Item', 'Publish item', () => { scForm.postEvent(this, 'click', 'item:publish(id=)'); }, canExecute)
            this.addCommand('Publish Site', 'Publish site', () => { scForm.postEvent(this, 'click', 'system:publish'); }, canExecute)
            this.addCommand('Open in Experience Editor', 'Start the Experience Editor.', () => { scForm.postEvent(this, 'click', 'webedit:openexperienceeditor'); }, canExecute)
            this.addCommand('Preview', 'Start the Preview mode.', () => { scForm.postEvent(this, 'click', 'item:preview'); }, canExecute)
            this.addCommand('Publishing viewer', 'View the publishing dates of each version.', () => { scForm.postEvent(this, 'click', 'item:publishingviewer(id=)'); }, canExecute)
            this.addCommand('Messages', 'Create, edit, and post a message on a target ntwork.', () => { scForm.invoke('social:dialog:show', 'click'); }, canExecute)

            //Versions
            this.addCommand('Reset Fields', 'Reset the field values.', () => { scForm.invoke('item:resetfields', 'click'); }, canExecute)
            this.addCommand('Add Version', 'Add a version of the selected item.', () => { scForm.postEvent(this, 'click', 'item:addversion(id=)'); }, canExecute)
            this.addCommand('Compare Versions', 'Compare the versions of the selected item.', () => { scForm.postEvent(this, 'click', 'item:compareversions'); }, canExecute)
            this.addCommand('Remove Version', 'Remove the item version that is currently displayed.', () => { scForm.postEvent(this, 'click', 'item:deleteversion'); }, canExecute)
            this.addCommand('Remove all versions', 'Remove all versions', () => { scForm.postEvent(this, 'click', 'item:removelanguage'); }, canExecute)
            this.addCommand('Translate', 'Show the translate mode.', () => { scForm.postRequest('', '', '', 'Translate_Click'); }, canExecute)

            //Configure
            this.addCommand('Help', 'Write help texts.', () => { scForm.postEvent(this, 'click', 'item:sethelp'); }, canExecute)
            this.addCommand('Editors', 'Configure the custom editors.', () => { scForm.postEvent(this, 'click', 'item:setcustomeditors'); }, canExecute)
            this.addCommand('Tree node style', 'Define the appearance in the content tree.', () => { scForm.postEvent(this, 'click', 'item:settreenodestyle'); }, canExecute)
            this.addCommand('Contextual tab', 'Specify a contextual tab in the ribbon.', () => { scForm.postEvent(this, 'click', 'item:setribbon'); }, canExecute)
            this.addCommand('Context menu', 'Specify the context menu.', () => { scForm.postEvent(this, 'click', 'item:setcontextmenu'); }, canExecute)
            this.addCommand('Bucket', 'Convert this item into an ite bucket. (Ctrl+Shift+B)', () => { scForm.invoke('item:bucket', 'click'); }, canExecute)
            this.addCommand('Revert', 'Revert this item bucket to a normal folder. (Ctrl+Shift+D)', () => { scForm.invoke('item:unbucket', 'click'); }, canExecute)
            this.addCommand('Sync', 'Synchronize this item bucket. (Ctrl+Shift+U)', () => { scForm.invoke('item:syncbucket', 'click'); }, canExecute)
            this.addCommand('Bucketable:Current item', 'Allow the current item to be stored as an unstructured item in an item bucket.', () => { scForm.postEvent(this, 'click', 'item:bucketable'); }, canExecute)
            this.addCommand('Bucketable:Standard values', 'Allow all items based on the Sample Item to be stored as an unstructured item in a bucket.', () => { scForm.postEvent(this, 'click', 'template:bucketable'); }, canExecute)
            this.addCommand('Set Masters', 'Assign insert options', () => { scForm.postEvent(this, 'click', 'item:setmasters'); }, canExecute)
            this.addCommand('Reset', 'Reset to the insert options defined on the template.', () => { scForm.postEvent(this, 'click', 'masters:reset'); }, canExecute)
            this.addCommand('Change Template', 'Change to another template.', () => { scForm.postEvent(this, 'click', 'item:changetemplate'); }, canExecute)
            this.addCommand('Edit Template', 'Open the Template Editor.', () => { scForm.postEvent(this, 'click', 'shell:edittemplate'); }, canExecute)
            this.addCommand('Hide Item', 'Mark the item as hidden or visible.', () => { scForm.postEvent(this, 'click', 'item:togglehidden'); }, canExecute)
            this.addCommand('Protect Item', 'Protect or unprotect the item from changes. (Ctrl+Shift+Alt+L)', () => { scForm.postEvent(this, 'click', 'item:togglereadonly'); }, canExecute)

            //Presentation
            this.addCommand('Layout Details', 'View and edit the layout details for the selected tem.', () => { scForm.invoke('item:setlayoutdetails', 'click'); }, canExecute)
            this.addCommand('Reset Layout', 'Reset the layout details to the settings defined n the template level.', () => { scForm.invoke('pagedesigner:reset', 'click'); }, canExecute)
            this.addCommand('Preview', 'Preview of the selected item presentation.', () => { scForm.invoke('contenteditor:preview', 'click'); }, canExecute)
            this.addCommand('Screenshots', 'Take screenshots of your webpages.', () => { scForm.invoke('contenteditor:pagepreviews(width=90%,height=90%)', 'click'); }, canExecute)
            this.addCommand('Aliases', 'Assign URL aliases.', () => { scForm.invoke('item:setaliases', 'click'); }, canExecute)
            this.addCommand('Set Feed Presentation', 'Set up the design of RSS feed for the selected item.', () => { scForm.invoke('item:setfeedpresentation', 'click'); }, canExecute)

            //Security
            this.addCommand('Remove Inherit', 'Security Preset: Remove Inherit', () => { scForm.invoke('item:securitypreset(preset={74A590B5-CC32-4777-8ADE-7369C753B7FF})'); }, canExecute)
            this.addCommand('Require Login', 'Security Preset: Require Login', () => { scForm.invoke('item:securitypreset(preset={506FC890-44A4-4037-8696-4934CB75C00A})'); }, canExecute)
            this.addCommand('Assign', 'Assign security rights for the selected item.', () => { scForm.invoke('item:openitemsecurityeditor', 'click'); }, canExecute)
            this.addCommand('Security Details', 'View assigned security rights for the selected item.', () => { scForm.invoke('contenteditor:opensecurity', 'click'); }, canExecute)
            this.addCommand('Change', 'Change of the ownership', () => { scForm.invoke('item:setowner', 'click'); }, canExecute)
            this.addCommand('Access Viewer', 'Open the Access Viewer.', () => { scForm.postEvent(this, 'click', 'shell:accessviewer'); }, canExecute)
            this.addCommand('User Manager', 'Open the User Manager.', () => { scForm.postEvent(this, 'click', 'shell:usermanager'); }, canExecute)

            //View
            this.addCommand('Content tree', 'Show or hide the content tree.', () => { scForm.postEvent(this, 'click', 'javascript:scContent.toggleFolders()'); }, canExecute);
            this.addCommand('Entire tree', 'Show or hide all the sections in the content tree.', () => { scForm.postEvent(this, 'click', 'EntireTree_Click'); }, canExecute);
            this.addCommand('Hidden items', 'Show or hide items marked with the Hidden attribute.', () => { scForm.postEvent(this, 'click', 'HiddenItems_Click'); }, canExecute);
            this.addCommand('Standard fields', 'Show or hide fields from the Standard Template (system fields). (Ctrl+Shift+Alt+T)', () => { scForm.postEvent(this, 'click', 'StandardFields_Click'); }, canExecute);
            this.addCommand('Raw values', 'Show field values as input boxes or as raw values. (Ctrl+Shift+Alt+R)', () => { scForm.postEvent(document, 'click', 'RawValues_Click'); }, canExecute);
            this.addCommand('Buckets', 'Show or hide the bucket repository items', () => { scForm.postEvent(this, 'click', 'contenteditor:togglebucketitems'); }, canExecute);

            //My Toolbar                
            this.addCommand('Customize', 'Customize My Toolbar', () => { scForm.invoke('ribbon:customize', 'click'); }, canExecute)

            //Developer
            this.addCommand('Create Template', 'Create a new template', () => { scForm.postEvent(this, 'click', 'templates:new'); }, canExecute)
            this.addCommand('Go to Master', 'Go to the first branch', () => { scForm.postEvent(this, 'click', 'item:gotomaster'); }, canExecute)
            this.addCommand('Go to Template', 'Go to the template', () => { scForm.postEvent(this, 'click', 'item:gototemplate'); }, canExecute)
            this.addCommand('Serialize item', 'Serialize the item to the file system', () => { scForm.postEvent(this, 'click', 'itemsync:dumpitem'); }, canExecute)
            this.addCommand('Serialize tree', 'Serialize the item and subitems to the file system', () => { scForm.postEvent(this, 'click', 'itemsync:dumptree'); }, canExecute)
            this.addCommand('Update item', 'Update the item from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaditem'); }, canExecute)
            this.addCommand('Revert item', 'Revert the item from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaditem(revert=1)'); }, canExecute)
            this.addCommand('Update tree', 'Update the item and subitems from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loadtree'); }, canExecute)
            this.addCommand('Revert tree', 'Revert the item and subitems from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loadtree(revert=1)'); }, canExecute)
            this.addCommand('Update database', 'Update the database from the file system. Not removing local modifications', () => { scForm.postEvent(this, 'click', 'itemsync:loaddatabase'); }, canExecute)
            this.addCommand('Revert database', 'Revert the database from the file system', () => { scForm.postEvent(this, 'click', 'itemsync:loaddatabase(revert=1)'); }, canExecute)
            this.addCommand('Rebuild all', 'Rebuild all the indexes.', () => { scForm.invoke('indexing:rebuildall', 'click'); }, canExecute)
            this.addCommand('Re-Index Tree', 'Rebuild the index for this item and its desendants.', () => { scForm.invoke('indexing:refreshtree', 'click'); }, canExecute)
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