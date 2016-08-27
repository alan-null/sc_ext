/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource {
    export class GoToDatasourceModule extends ModuleBase implements ISitecoreExtensionsModule {
        className: string = "sc-ext-goToDatasource"

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        private getFields(fieldSelector: string, objectInitializer: Fields.FieldInitializer) {
            let fields = document.querySelectorAll(fieldSelector);
            for (let i = 0; i < fields.length; i++) {
                var rawField = fields[i] as HTMLSelectElement;
                if (!rawField.classList.contains(this.className)) {
                    let field = objectInitializer(rawField) as Fields.IDatasourceField
                    field.initialize();
                }
            }
        }

        private refreshFields(): void {
            this.getFields(".scContentControlMultilistBox", (field) => {
                return new Fields.ListField(field);
            });
            this.getFields(".scContentControl.scCombobox", (field) => {
                return new Fields.DropLink(field);
            });
            this.getFields(".scCombobox select.scCombobox", (field) => {
                return new Fields.NameLookupValueList(field);
            });
        }

        private addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.refreshFields();
                    }, 10);
                });
            }
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.refreshFields());
            this.addTreeNodeHandlers('scContentTree');
            HTMLHelpers.addProxy(scSitecore, 'postEvent', () => { this.refreshFields() });
            HTMLHelpers.addProxy(scForm, 'invoke', () => this.refreshFields());
        }
    }
}
