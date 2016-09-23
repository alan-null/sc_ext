/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.LastLocation {
    export class RestoreLastLocation extends ModuleBase implements ISitecoreExtensionsModule {

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            this.addTreeNodeHandlers('scContentTree');
        }

        updateLastLocation(args: any): void {
            var parent = args.element();
            if ((parent as HTMLDivElement).classList.contains("scContentTreeNode")) {
                parent = parent.querySelector("a");
            } else {
                parent = HTMLHelpers.getElement(parent, (n) => {
                    return n.tagName.toLowerCase() === "a";
                });
            }

            if (parent) {
                let id = parent.id;
                id = id.substring(id.lastIndexOf("_") + 1);
                LastLocationStore.saveLastItemId(id);
            }
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    this.updateLastLocation(evt);
                });
            }
        }
    }
}
