/// <reference path='_all.ts'/>

namespace SitecoreExtensions {
    import ISitecoreExtensionsModule = Modules.ISitecoreExtensionsModule;

    export class ExtensionsManager {
        modules: ISitecoreExtensionsModule[];
        modulesOptions:  Options.IModuleOptions[];
        constructor() {
            this.modules = new Array<ISitecoreExtensionsModule>();
        }

        addModule(module: ISitecoreExtensionsModule): void {
            this.modules.push(module);
        }

        private initModule(m: ISitecoreExtensionsModule) {
            try {
                m.initialize();
            } catch (e) {
                console.log('Cannot initialize module: ' + m.moduleName);
                console.log(e);
            }
        }

        initModules(): void {
            this.modules
                .filter(m => { return m.canExecute(); })
                .forEach(m => { this.initModule(m) });
        }

        getModule(type: any): ISitecoreExtensionsModule {
            for (var index = 0; index < this.modules.length; index++) {
                var m = this.modules[index];
                if (m.constructor === type) {
                    return m;
                }
            }
            return null;
        }
    }
}