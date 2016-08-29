/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Status {
    declare var scExtManager: SitecoreExtensions.ExtensionsManager;
    import ISitecoreExtensionsModule = Modules.ISitecoreExtensionsModule;
    import LauncherModule = Modules.Launcher.LauncherModule;

    export class ModulesStatusProvider implements IStatusProvider {
        private globalModulesKey: string = "scExtManagerGlobalContextModules";
        private globalModulesNames: string[] = ["Database Name", "Database Colour"];

        constructor() {
            this.saveState();
        }

        public saveState() {
            var globalModules = window.top[this.globalModulesKey] || new Array<ISitecoreExtensionsModule>();
            for (let i = 0; i < this.globalModulesNames.length; i++) {
                let m = scExtManager.getModuleByName(this.globalModulesNames[i]);
                if (m != null && m.canExecute()) {
                    globalModules.push(m);
                }
            }
            window.top[this.globalModulesKey] = globalModules;
        }

        public getStatus(): string {
            return this.getModulesCount().toString();
        }

        private getAvailableCommandsCount(): string {
            var launcher = scExtManager.getModule(LauncherModule) as LauncherModule;
            var availableCommands = launcher.commands.filter((m) => { return m.canExecute(); });
            return availableCommands.length.toString();
        }

        private getModulesCount(): number {
            return this.getActiveModules().length;
        }

        private getActiveModules(): ISitecoreExtensionsModule[] {
            var activeModules = scExtManager.modules.filter(m => { return m.canExecute(); });
            var globalModules = window.top[this.globalModulesKey] || new Array<ISitecoreExtensionsModule>();
            for (var index = 0; index < globalModules.length; index++) {
                activeModules.push(globalModules[index]);
            }
            return this.getUniqueModules(activeModules);
        }

        private getUniqueModules(modules: ISitecoreExtensionsModule[]) {
            var result = new Array<ISitecoreExtensionsModule>();
            for (var i = 0, l = modules.length; i < l; i++)
                if (result.filter(m => { return m.moduleName == modules[i].moduleName; }).length == 0)
                    result.push(modules[i]);
            return result;
        }
    }
}