/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.SectionSwitches.Pipelines.GetCommands {
    export class GetSectionSwitchesCommands extends GetCommandsProcessor {
        getCommands(): ICommand[] {
            return new SectionSwitchesCommandsProvider().getCommands()
        }
    }
}

