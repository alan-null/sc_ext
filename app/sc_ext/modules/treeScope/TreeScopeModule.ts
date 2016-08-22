/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeScope {


    export class TreeScopeModule extends ModuleBase implements ISitecoreExtensionsModule {
        private treeScopeClass: string = "sc-ext-tree-scope";
        private idScopedElement: string = "sc-ext-treescope-scoped-node";

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            HTMLHelpers.addProxy(scForm, 'invoke', (e) => { this.insertTreeScopeButton(e); });
        }

        private addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.insertTreeScopeButton(evt);
                    }, 10);
                });
            }
        }

        private insertTreeScopeButton(e): void {
            if (document.getElementsByClassName(this.treeScopeClass).length > 0) {
                return;
            }
            let popup = new Popup(document.querySelector(".scPopup") as HTMLDivElement);
            if (popup.popupElement == null) {
                return;
            }

            let activeNodeID = this.getActiveTreeNodeID(e[0]);
            if (!document.querySelector("#" + this.idScopedElement)) {
                let scopeButton = new PopupButton(activeNodeID, (e) => {
                    this.scopeTreeCallback(e);
                    popup.hide();
                });
                scopeButton.iconImage = "/~/icon/wordprocessing/32x32/increase_indent_h.png";
                scopeButton.captionText = "Scope";
                scopeButton.hotkeyImage = "/sitecore/images/blank.gif";
                scopeButton.buttonClass = this.treeScopeClass;
                popup.appendPopupButton(scopeButton, popup.getIndexOfElement("__Refresh"));
            } else {
                let descopeButton = new PopupButton(activeNodeID, (e) => {
                    this.descopeTreeCallback(e);
                    popup.hide();
                });
                descopeButton.iconImage = "/~/icon/wordprocessing/32x32/line_spacing_h.png";
                descopeButton.captionText = "Descope";
                descopeButton.hotkeyImage = "/sitecore/images/blank.gif";
                descopeButton.buttonClass = this.treeScopeClass;
                popup.appendPopupButton(descopeButton, popup.getIndexOfElement("__Refresh"));
            }
        };

        private scopeTreeCallback(activeNodeID: string) {
            let activeNode = document.querySelector("#" + activeNodeID).parentNode;
            let tree = new ContentEditorTree();
            let nodeClode = activeNode.cloneNode(true) as HTMLDivElement;
            nodeClode.id = this.idScopedElement;

            tree.hide();
            tree.addTreeNode(nodeClode);
        }

        private descopeTreeCallback(activeNodeID: string) {
            let scopedElement = document.querySelector("#" + this.idScopedElement);
            let tree = new ContentEditorTree();

            tree.show();
            scopedElement.remove();
        }

        private getActiveTreeNodeID(value: string): string {
            return value.match(/Tree_Node_[A-Z0-9]*/)[0];
        }
    }
}