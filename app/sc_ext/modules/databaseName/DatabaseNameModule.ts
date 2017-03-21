/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseName {
    import DatabaseChangeEventArgs = Events.DatabaseChangeEventArgs;

    export class DatabaseNameModule extends ModuleBase implements ISitecoreExtensionsModule {
        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Database() != null && document.querySelector('.sc-globalHeader-loginInfo') != null;
        }

        initialize(): void {
            var dbName = Context.Database();
            if (dbName != null) {
                this.addDbNameToHeader(dbName.toUpperCase());
            }

            new Events.EventHandler("onDatabaseChange", (args: DatabaseChangeEventArgs) => { this.onDatabaseChange(args); });
        }

        onDatabaseChange(args: DatabaseChangeEventArgs) {
            this.removeDbNameFromHeader();
            this.addDbNameToHeader(args.databaseName.toUpperCase());
        }

        addDbNameToHeader(dbName: string): void {
            var dbnameDiv = HTMLHelpers.createElement<HTMLDivElement>('div', { class: 'sc-ext-dbName' });
            dbnameDiv.innerText = dbName;

            let destination = document.querySelector('.sc-globalHeader');
            destination.insertBefore(dbnameDiv, destination.firstChild);
        }

        removeDbNameFromHeader(): void {
            let element = document.querySelector('.sc-ext-dbName');
            if (element) {
                element.remove();
            }
        }
    }
}
