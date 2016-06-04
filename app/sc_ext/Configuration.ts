/// <reference path='_all.ts'/>

namespace SitecoreExtensions {
    var configuration = {
        pipelines: {
            getModules: [
                new SitecoreExtensions.Modules.SectionSwitches.Pipelines.GetModules.RegisterSectionSwitches(),
                new SitecoreExtensions.Modules.DatabaseName.Pipelines.GetModules.RegisterDatabaseName(),
                new SitecoreExtensions.Modules.Launcher.Pipelines.GetModules.RegisterLauncher(),
                new SitecoreExtensions.Modules.DatabaseColor.Pipelines.GetModules.RegisterDatabaseColor(),
                new SitecoreExtensions.Modules.LastLocation.Pipelines.GetModules.RegisterRestoreLastLocation(),
                new SitecoreExtensions.Modules.FieldSearch.Pipelines.GetModules.RegisterFieldSearch(),
            ]
        }
    };

    export class Configuration {
        static Get() { return configuration; }
    }
}
