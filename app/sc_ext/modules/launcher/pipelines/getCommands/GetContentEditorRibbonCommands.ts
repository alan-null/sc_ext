/// <reference path='../../_all.ts'/>


namespace SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands {
    export class GetContentEditorRibbonCommands extends GetCommandsProcessor {
        getCommands(): ICommand[] {            
            return new Providers.ContentEditorRibbonCommandsProvider().getCommands();
        }
    }
}

