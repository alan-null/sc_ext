/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.LastLocation {
    import ICommand = Launcher.ICommand;

    export class RestoreLastLocationCommandProvider implements Launcher.Providers.ICommandsProvider {
        getCommands(): ICommand[] {
            var cmd: ICommand = {
                id: 0,
                name: "Restore Last Opened Item",
                description: "Restores last opened item in Content Editor",
                execute: () => {
                    var lastItem = LastLocationStore.loadLastItemId();
                    if (lastItem) {
                        scForm.postRequest("", "", "", "LoadItem(\"" + lastItem + "\")");
                    }
                },
                canExecute: () => { return Context.Location() == Enums.Location.ContentEditor; }
            };
            return [
                cmd
            ];
        }
    }
}
