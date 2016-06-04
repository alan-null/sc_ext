/// <reference path='_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseColor {
    export class DatabaseColorModule extends ModuleBase implements ISitecoreExtensionsModule {
        coloursMapping: Types.IDictionary;
        options: DatabaseColorOptions;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description);
            this.options = new DatabaseColorOptions();
            this.mapOptions<DatabaseColorOptions>(rawOptions)
            this.coloursMapping = new Types.Dictionary([
                { key: 'WEB', value: '#DC291E' },
            ]);
        }

        changeheaderColor(dbName: string): void {
            if (this.coloursMapping.containsKey(dbName)) {
                var header = document.getElementsByClassName('sc-globalHeader-content')[0];
                header.setAttribute("style", "background-color: " + this.coloursMapping[dbName] + ";")
            }
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Database() != null && document.querySelector('.sc-globalHeader-content') != null;
        }

        initialize(): void {
            var dbName = Context.Database();
            if (dbName != null) {
                this.changeheaderColor(dbName.toUpperCase());
            }
        }
    }
}