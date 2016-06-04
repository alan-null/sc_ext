/// <reference path='../../_all.ts'/>

// import GetModulesProcessor = SitecoreExtensions.Pipelines.GetModules.GetModulesProcessor
// import GetModulesArgs = SitecoreExtensions.Pipelines.GetModules.GetModulesArgs

namespace SitecoreExtensions.Modules.SectionSwitches.Pipelines.GetModules {
    export class RegisterSectionSwitches extends GetModulesProcessor {
        run(args: GetModulesArgs) {
            var sectionSwitchesModule = new Modules.SectionSwitches.SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click');
            args.addModule(sectionSwitchesModule);

            this.onProcessed();
        }
    }
}

