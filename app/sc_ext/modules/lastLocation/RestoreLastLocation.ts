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
            var id;
            var parent = args.element();
            while (parent && parent.tagName && parent.tagName != "BODY") {
                if (parent.tagName && parent.tagName.toLowerCase() === "a") {
                    id = parent.id;
                    id = id.substring(id.lastIndexOf("_") + 1);
                    LastLocationStore.saveLastItemId(id);
                    return ;
                }
                parent = parent.parentElement
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

        initialize(): void {
            this.addTreeNodeHandlers('scContentTree');
        }
    }
}
