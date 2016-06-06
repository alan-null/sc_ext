/// <reference path='../../_all.ts'/>

import GetCommandsProcessor = SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands.GetCommandsProcessor
import ICommand = SitecoreExtensions.Modules.Launcher.ICommand

namespace SitecoreExtensions.Modules.LastLocation.Pipelines.GetCommands {
    export class GetLastLocationCommands extends GetCommandsProcessor {
        getCommands(): ICommand[] {
            return new RestoreLastLocationCommandProvider().getCommands()
        }
    }
}