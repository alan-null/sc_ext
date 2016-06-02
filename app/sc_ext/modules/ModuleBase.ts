/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Modules {
    import ModuleOptions = Options.ModuleOptions;
    import ModuleOptionsBase = Options.ModuleOptionsBase;

    export class ModuleBase {
        moduleName: string;
        description: string;
        options: ModuleOptions;
        optionsMapper: SitecoreExtensions.Options.IOptionsMapper;
        constructor(name: string, description: string, rawOptions?: ModuleOptionsBase) {
            this.moduleName = name;
            this.description = description;
            this.options = new ModuleOptions();
            if (rawOptions != null) {
                this.mapOptions<ModuleOptions>(rawOptions);
            }
        }

        getOptionsMapper(): SitecoreExtensions.Options.IOptionsMapper {
            return new SitecoreExtensions.Options.OptionsAutoMapper();
        }

        mapOptions<T>(rawOptions: ModuleOptionsBase) {
            if (rawOptions != null) {
                this.options = this.getOptionsMapper().mapOptions(rawOptions, this.options);
            }
        }
    }
}