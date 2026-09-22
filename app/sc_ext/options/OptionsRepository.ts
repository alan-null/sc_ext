/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Options {
    export class OptionsRepository {
        constructor(getOptionsCallback?: any) {
        }

        async getOptions(): Promise<OptionsWrapper> {
            return new Promise<OptionsWrapper>(returnValue => {
                new OptionsProvider().getOptions((result: OptionsWrapper) => {
                    returnValue(result || new OptionsWrapper([]));
                });
            });
        }

        async getModuleOptions(moduleName: string): Promise<ModuleOptionsBase> {
            return new Promise<ModuleOptionsBase>(returnValue => {
                new OptionsProvider().getModuleOptions(moduleName, (result: ModuleOptionsBase) => {
                    returnValue(result);
                });
            });
        }


        setOptions(modulesOptions: IModuleOptions[]): void {
            new OptionsProvider().setOptions(modulesOptions, () => { });
        }

        setModuleOptions(moduleOptions: IModuleOptions): void {
            new OptionsProvider().setModuleOptions(moduleOptions);
        }
    }
}

