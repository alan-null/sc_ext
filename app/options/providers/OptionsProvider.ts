/// <reference path='../../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../../typings/es6-shim/es6-shim.d.ts'/>

namespace SitecoreExtensions.Options {
    'use strict';

    export interface IModuleOptions {
        name: string;
        model: any;
    }

    export class ModuleOptionsBase implements IModuleOptions {
        name: string;
        model: any;
        constructor(name: string, model: any) {
            this.name = name;
            this.model = model;
        }
    }

    export class OptionsWrapper {
        options: IModuleOptions[];

        constructor(options: IModuleOptions[]) {
            this.options = options;
        }

        static create(optionsWrapper: OptionsWrapper): OptionsWrapper {
            return new OptionsWrapper(optionsWrapper.options);
        }

        getModuleOptions(moduleName: string): IModuleOptions {
            if (this.options != null) {
                return this.options.find(m => { return m.name == moduleName; });
            }
        }

        setModuleOptions(options: IModuleOptions): void {
            var moduleOptions = this.getModuleOptions(options.name);
            var index = this.options.indexOf(moduleOptions);
            if (index !== -1) {
                this.options[index] = options;
            } else {
                this.options.push(options);
            }
        }
    }

    declare type GetOptionsCallback = (arg: OptionsWrapper) => void;

    export class OptionsProvider {
        getOptions(done: GetOptionsCallback): void {
            chrome.storage.local.get({
                sc_ext_options: null,
            }, function (items: any) {
                done(items.sc_ext_options);
            });
        }

        setOptions(moduleOptions: IModuleOptions[], done: any): void {
            chrome.storage.local.set({
                sc_ext_options: new OptionsWrapper(moduleOptions),
            }, done);
        }

        getModuleOptions(name: string, done: any): void {
            this.getOptions((optionsWrapper) => {
                if (optionsWrapper != null) {
                    done(OptionsWrapper.create(optionsWrapper).getModuleOptions(name));
                }
            });
        }

        setModuleOptions(options: IModuleOptions): void {
            this.getOptions((optionsWrapper) => {
                if (optionsWrapper != null) {
                    (OptionsWrapper.create(optionsWrapper)).setModuleOptions(options);
                } else {
                    var array = new Array<IModuleOptions>();
                    array.push(options);
                    optionsWrapper = new OptionsWrapper(array);
                }
                chrome.storage.local.set({ sc_ext_options: optionsWrapper });
            });
        }
    }
}