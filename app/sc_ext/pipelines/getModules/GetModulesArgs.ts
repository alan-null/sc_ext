/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Pipelines.GetModules {
    export class GetModulesArgs implements IPipepineArgs {
        private options: Options.OptionsWrapper
        modules: Modules.ISitecoreExtensionsModule[]

        constructor(options: Options.OptionsWrapper) {
            this.modules = new Array<Modules.ISitecoreExtensionsModule>();
            this.options = options;
        }

        addModule(module: Modules.ISitecoreExtensionsModule): void {
            this.modules.push(module);
        }

        getModuleOptions(moduleName: string): Options.ModuleOptionsBase {
            return this.options.getModuleOptions(moduleName);
        }
    }
}

