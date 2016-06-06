/// <reference path='../../_all.ts'/>

import ProcessorBase = SitecoreExtensions.Pipelines.ProcessorBase

namespace SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands {
    export abstract class GetCommandsProcessor extends ProcessorBase {
        run(args: GetCommandsArgs) {
            args.registerCommands(this.getCommands())
            this.onProcessed();
        }

        abstract getCommands(): ICommand[];
    }
}

