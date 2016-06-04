/// <reference path='../../_all.ts'/>

import GetModulesProcessor = SitecoreExtensions.Pipelines.GetModules.GetModulesProcessor
import GetModulesArgs = SitecoreExtensions.Pipelines.GetModules.GetModulesArgs

namespace SitecoreExtensions.Modules.Launcher.Pipelines.GetModules {
    export class RegisterLauncher extends GetModulesProcessor {
        run(args: GetModulesArgs) {            
            var launcher = new Modules.Launcher.LauncherModule('Launcher', 'Feel like power user using Sitecore Extensions command launcher.', args.getModuleOptions('Launcher'));
            args.addModule(launcher);

            this.onProcessed();
        }
    }
}

