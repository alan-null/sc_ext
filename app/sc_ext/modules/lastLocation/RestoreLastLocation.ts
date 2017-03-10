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
            HTMLHelpers.addProxy(scSitecore, 'postEvent', () => { this.saveCurrentLocationAfterChange(); });
            HTMLHelpers.addProxy(scForm, 'invoke', () => { this.saveCurrentLocationAfterChange(); });
        }

        private getElement(args: any): Element {
            if (args["element"] != null) {
                return args.element();
            }
        }

        private updateLastLocation(parent: Element): void {
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

        private addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    let element = this.getElement(evt);
                    this.updateLastLocation(element);
                });
            }
        }

        private saveCurrentLocationAfterChange() {
            let contentTree = new PageObjects.ContentTree();
            contentTree.onActiveTreeNodeChanged(_ => {
                    this.updateLastLocation(document.querySelector(".scContentTreeNodeActive"));
            });
        }
    }
}
