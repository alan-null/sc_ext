/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export class ContentEditorCommandsProvider extends BaseCommandsProvider {
        constructor() {
            super();
        }

        createCommands(): void {
            var canExecute = () => { return Context.Location() == Enums.Location.ContentEditor; };

            this.addInvokeCommand('Unclone', 'Unclone current item and all children', 'item:unclone', canExecute);
            this.addInvokeCommand('Unclone item', 'Unclone single item', 'item:uncloneitem', canExecute);
            this.addInvokeCommand('New folder', 'Create new Common/Folder', 'item:newfolder', canExecute);
            this.addInvokeCommand('Assign Security Rights', 'Edit permissions for the selected item', 'item:openitemsecurityeditor', canExecute);
            this.addInvokeCommand('Remove language', 'Remove every version of the item in the current language.', 'item:removelanguage', canExecute);
            this.addInvokeCommand('Select icon', 'Select the new icon that you want to assign to the selected item', 'item:selecticon', canExecute);
            this.addInvokeCommand('Select language', 'Select the language that you want', 'item:selectlanguage', canExecute);
            this.addInvokeCommand('Custom Editors', 'Select the custom editors for the current item.', 'item:setcustomeditors', canExecute);
            this.addInvokeCommand('Set Initial Workflow', 'Select the workflow that you want to use', 'item:setdefaultworkflow', canExecute);
            this.addInvokeCommand('Reset default workflow', 'Set the initial workflow to none', 'item:resetdefaultworkflow', canExecute);
            this.addInvokeCommand('Change ownership (set owner)', 'Change the owner of the item.', 'item:setowner', canExecute);
            this.addInvokeCommand('Sort order of subitems (subitems sorting)', 'Select the criteria for how the subitems must be sorted', 'item:setsubitemssorting', canExecute);
            this.addInvokeCommand('Transfer item to database', 'Move an Item to Another Database', 'item:transfertodatabase', canExecute);
            this.addInvokeCommand('Upload Files', 'Upload files to a media library', 'item:upload', canExecute);
            this.addInvokeCommand('Reset Masters (insert options)', 'Reset the insert options to those defined in the template', 'masters:reset', canExecute);
            this.addInvokeCommand('New media folder', 'Create new Media/Media folder', 'media:newfolder', canExecute);
            this.addInvokeCommand('Download media', 'Download attached media file', 'media:download', canExecute);
            this.addInvokeCommand('View media', 'View attached media file', 'media:view', canExecute);
            this.addDeepLinkCommand();
        }

        private addDeepLinkCommand() {
            let command = new DynamicCommand("Deep link", "Stores url to the current item into clipboard.", "");
            command.executeCallback = (cmd: DynamicCommand, evt: UserActionEvent) => {
                var url = window.top.location.origin + "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1";
                let id = cmd.ItemId;
                if (id) {
                    url += "&fo=" + id;
                    HTMLHelpers.copyTextToClipboard(url);
                }
            };
            command.canExecuteCallback = () => { return Context.Location() == Enums.Location.ContentEditor; };
            this.commands.push(command);
        }
    }
}