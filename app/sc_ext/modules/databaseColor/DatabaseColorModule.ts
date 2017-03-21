/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseColor {
    import DatabaseChangeEventArgs = Events.DatabaseChangeEventArgs;

    export class DatabaseColorModule extends ModuleBase implements ISitecoreExtensionsModule {
        coloursMapping: Types.IDictionary;
        options: DatabaseColorOptions;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description);
            this.options = new DatabaseColorOptions();
            this.mapOptions<DatabaseColorOptions>(rawOptions);
            this.coloursMapping = new Types.Dictionary([
                { key: 'WEB', value: '#DC291E' },
            ]);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Database() != null && document.querySelector('.sc-globalHeader-content') != null;
        }

        initialize(): void {
            var dbName = Context.Database();
            if (dbName != null) {
                this.changeheaderColor(dbName.toUpperCase());
            }

            new Events.EventHandler("onDatabaseChange", (args: DatabaseChangeEventArgs) => { this.onDatabaseChange(args); });
        }

        onDatabaseChange(args: DatabaseChangeEventArgs) {
            this.changeheaderColor(args.databaseName.toUpperCase());
        }

        changeheaderColor(dbName: string): void {
            let header = document.getElementsByClassName('sc-globalHeader-content')[0];
            if (this.coloursMapping.containsKey(dbName)) {
                header.setAttribute("style", "background-color: " + this.coloursMapping[dbName] + ";");
            } else {
                header.removeAttribute("style");
            }
        }
    }
}