/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Options {
    export interface IOptionsMapper {
        mapOptions<T>(rawOptions: ModuleOptionsBase, otpions: T): T;
    }

    export class OptionsAutoMapper implements IOptionsMapper {
        mapOptions<T>(rawOptions: ModuleOptionsBase, options: T): T {
            for (var f in rawOptions.model) {
                if (options.hasOwnProperty(f)) {
                    options[f] = rawOptions.model[f];
                }
            }
            return options;
        }
    }
}

