/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FieldInspector {
    export class FieldInspectorOptions extends SitecoreExtensions.Options.ModuleOptions {
        fieldName: {
            highlightText: boolean
        } = { highlightText: true};

        constructor(wrapper: any) {
            super();
            if (wrapper != null) {
                this.enabled = wrapper.model.enabled;
                this.fieldName.highlightText = wrapper.model.fieldName.highlightText;
            };
        }
    }
}
