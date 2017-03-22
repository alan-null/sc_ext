/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseColor {
    export class DatabaseColorOptions extends Options.ModuleOptions {
        colors: Options.DatabaseColorMapping[] = new Array<Options.DatabaseColorMapping>();
        constructor() {
            super();
            let defaultcolor = new Options.DatabaseColorMapping("WEB", "DC291E", 0);
            this.colors.push(defaultcolor);
        }
    }
}