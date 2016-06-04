/// <reference path='../../_all.ts'/>

// import GetModulesProcessor = SitecoreExtensions.Pipelines.GetModules.GetModulesProcessor
// import GetModulesArgs = SitecoreExtensions.Pipelines.GetModules.GetModulesArgs

namespace SitecoreExtensions.Modules.DatabaseName.Pipelines.GetModules {
    export class RegisterDatabaseName extends GetModulesProcessor {
        run(args: GetModulesArgs) {
            var dbNameModule = new Modules.DatabaseName.DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header', args.getModuleOptions('Database Name'));
            args.addModule(dbNameModule);

            this.onProcessed();
        }
    }
}

