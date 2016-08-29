/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FieldSearch {
    export class FieldSearchOptions extends SitecoreExtensions.Options.ModuleOptions {
        inputbox: {
            rememberValue: boolean
        } = { rememberValue: true};

        constructor(wrapper: any) {
            super();
            if (wrapper != null) {
                this.enabled = wrapper.model.enabled;
                this.inputbox.rememberValue = wrapper.model.inputbox.rememberValue == "remmeber";
            };
        }
    }
}
