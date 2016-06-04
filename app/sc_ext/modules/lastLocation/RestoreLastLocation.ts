/// <reference path='_all.ts'/>

namespace SitecoreExtensions.Modules.LastLocation {
    export class RestoreLastLocation extends ModuleBase implements ISitecoreExtensionsModule {
        canExecute(): boolean {
            return Context.Location() == Enums.Location.ContentEditor;
        }

        updateLastLocation(args: any): void {
            var id;
            for (let i = 0, l = args.path.length; i < l; i++) {
                let parent = args.path[i];
                if (parent.tagName && parent.tagName.toLowerCase() === "a") {
                    id = parent.id;
                    id = id.substring(id.lastIndexOf("_") + 1);
                    LastLocationStore.saveLastItemId(id);
                    break;
                }
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
