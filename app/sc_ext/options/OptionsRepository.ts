/// <reference path='../_all.ts'/>

import Communication = SitecoreExtensions.Common.Communication;

namespace SitecoreExtensions.Options {
    export class OptionsRepository {
        constructor(getOptionsCallback?: any) {
        }

        getOptions(): Promise<OptionsWrapper> {
            return new Promise<OptionsWrapper>(returnValue => {
                window.addEventListener('message', function (event) {
                    let validator = new Communication.DataParser();
                    let instance = validator.tryParse<Communication.GetOptionsResponseMessage>(event.data);
                    if (instance instanceof Communication.GetOptionsResponseMessage) {
                        if (instance.optionsWrapper && instance.optionsWrapper.options) {
                            returnValue(instance.optionsWrapper);
                        } else {
                            returnValue(new OptionsWrapper([]));
                        }
                    }
                });
                let message = new Communication.GetOptionsRequestMessage();
                window.postMessage(message, '*');
            });
        }

        getModuleOptions(moduleName: string): Promise<ModuleOptionsBase> {
            return new Promise<ModuleOptionsBase>(returnValue => {
                window.addEventListener('message', function (event) {
                    let validator = new Communication.DataParser();
                    let instance = validator.tryParse<Communication.GetModuleOptionsResponseMessage>(event.data);
                    if (instance instanceof Communication.GetModuleOptionsResponseMessage) {
                        returnValue(instance.moduleOptions);
                    }
                });
                let message = new Communication.GetModuleOptionsRequestMessage(moduleName);
                window.postMessage(message, '*');
            });
        }


        setOptions(modulesOptions: IModuleOptions[]): void {
            let message = new Communication.SetOptionsRequestMessage(modulesOptions);
            window.postMessage(message, '*');
        }

        setModuleOptions(moduleOptions: IModuleOptions): void {
            let message = new Communication.SetModuleOptionsRequestMessage(moduleOptions);
            window.postMessage(message, '*');
        }
    }
}

