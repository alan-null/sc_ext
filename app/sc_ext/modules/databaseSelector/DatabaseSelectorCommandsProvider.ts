/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseSelector {
    import ICommand = Launcher.ICommand;

    export class DatabaseNamesStore {
        private static localStorageKey: string = "sc_ext::db_names";

        public static saveDatabases(dbs: Array<string>): void {
            localStorage.setItem(this.localStorageKey, dbs.join(','));
        }

        public static getDatabases(): Array<string> {
            let raw = localStorage.getItem(this.localStorageKey);
            if (raw) {
                return raw.split(',');
            }
            return new Array<string>();
        }
    }

    export class DatabaseSelectorCommandsProvider implements Launcher.Providers.ICommandsProvider {
        private commands: ICommand[];

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }

        public getCommands(): ICommand[] {
            return this.commands;

        }

        private createCommands() {
            let dbs = DatabaseNamesStore.getDatabases();
            if (dbs) {
                for (let index = 0; index < dbs.length; index++) {
                    var databaseName = dbs[index];
                    var cmd: ICommand = {
                        id: 0,
                        name: 'Change database: ' + databaseName,
                        description: 'Change current database to ' + databaseName,
                        execute: (e: KeyboardEvent) => {
                            let url = window.top.location.origin + "/sitecore/shell/default.aspx?sc_content=" + dbs[index];
                            new Http.HttpRequest(url, Http.Method.GET, null).execute();
                            if (e.ctrlKey) {
                                let location = window.top.location;
                                new Launcher.Providers.NavigationCommand(null, null, location.href).execute(e);
                            }
                        },
                        canExecute: () => { return true; }
                    };
                    this.commands.push(cmd);
                }
            }
        }
    }
}