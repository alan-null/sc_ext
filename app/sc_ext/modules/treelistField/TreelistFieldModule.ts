/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreelistField {
    export class TreelistFieldModule extends ModuleBase implements ISitecoreExtensionsModule {
        className: string = "sc-ext-treelist"

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        addPathToTreelistField(): void {
            let treeListFields = document.querySelectorAll(".scContentControl.scTreelistEx:not(." + this.className + ")")
            for (var i = 0; i < treeListFields.length; i++) {
                var field = treeListFields[i];
                field.classList.add(this.className);
                if (field.childNodes.length > 0) {
                    for (var j = 0; j < field.childNodes.length; j++) {
                        var itemRow = field.childNodes[j] as HTMLDivElement;;
                        let pathSpan = HTMLHelpers.createElement("span", { class: "sc-ext-treelist-path" }) as HTMLSpanElement
                        pathSpan.innerText = itemRow.title
                        pathSpan.onclick = () => { HTMLHelpers.selectNodeContent(pathSpan); }
                        
                        itemRow.appendChild(pathSpan)
                    }
                }
            }
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.addPathToTreelistField();
                    }, 10);
                });
            }
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.addPathToTreelistField());
            this.addTreeNodeHandlers('scContentTree');
            HTMLHelpers.addProxy(scSitecore, 'postEvent', () => this.addPathToTreelistField());
            HTMLHelpers.addProxy(scForm, 'invoke', () => this.addPathToTreelistField());
        }
    }
}
