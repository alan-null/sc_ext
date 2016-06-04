/// <reference path='../../_all.ts'/>

// import GetModulesProcessor = SitecoreExtensions.Pipelines.GetModules.GetModulesProcessor
// import GetModulesArgs = SitecoreExtensions.Pipelines.GetModules.GetModulesArgs

namespace SitecoreExtensions.Modules.DatabaseColor.Pipelines.GetModules {
    export class RegisterDatabaseColor extends GetModulesProcessor {
        run(args: GetModulesArgs) {
            var databaseColour = new Modules.DatabaseColor.DatabaseColorModule("Database Colour", 'Change the global header colour depeding on current database.', args.getModuleOptions('Database Colour'));

            args.addModule(databaseColour);

            this.onProcessed();
        }
    }
}