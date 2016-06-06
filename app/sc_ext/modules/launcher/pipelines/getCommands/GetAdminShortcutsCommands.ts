/// <reference path='../../_all.ts'/>


namespace SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands {
    export class GetAdminShortcutsCommands extends GetCommandsProcessor {
        getCommands(): ICommand[]{
            return new Providers.AdminShortcutsCommandsProvider().getCommands();
        }
    }
}

