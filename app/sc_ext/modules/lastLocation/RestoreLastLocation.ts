/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.LastLocation {
    export class RestoreLastLocation extends ModuleBase implements ISitecoreExtensionsModule {

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        updateLastLocation(args: any): void {
            var parent = args.element();
            parent = HTMLHelpers.getElement(parent, (n) => {
                return n.tagName.toLowerCase() === "a";
            });

            let id = parent.id;
            id = id.substring(id.lastIndexOf("_") + 1);
            LastLocationStore.saveLastItemId(id);
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    this.updateLastLocation(evt);
                });
            }
        }

        initialize(): void {
            this.addTreeNodeHandlers('scContentTree');
        }
    }
}
