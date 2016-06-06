/// <reference path='_all.ts'/>

namespace SitecoreExtensions {
    const configuration: any = {
        pipelines: {
            getCommands: [
                new SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands.GetAdminShortcutsCommands(),
                new SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands.GetContentEditorRibbonCommands(),
                new SitecoreExtensions.Modules.LastLocation.Pipelines.GetCommands.GetLastLocationCommands(),
                new SitecoreExtensions.Modules.SectionSwitches.Pipelines.GetCommands.GetSectionSwitchesCommands(),
            ],
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
        public static Get(): any { return configuration; }
    }
}
