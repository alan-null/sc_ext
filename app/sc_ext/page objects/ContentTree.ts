/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.PageObjects {

    export class ContentTree {
        private element: HTMLElement;

        constructor() {
            const panel = document.getElementById("ContentTreeInnerPanel");
            if (panel != null) {
                this.element = panel;
            }
        }

        public getActiveTreeNode(): HTMLElement {
            return document.querySelector(".scContentTreeNodeActive") as HTMLElement;
        }

        public loadItem(id: string): void {
            scForm.postRequest("", "", "", "LoadItem(\"" + id + "\")");

            let currentlySelectedElementId = this.getActiveTreeNode().id;
            HTMLHelpers.postponeAction(_ => {
                let active = this.getActiveTreeNode().id;
                return active.length > 0 && active !== currentlySelectedElementId;
            }, _ => {
                this.scrollToActiveNode();
                this.getActiveTreeNode().click();
            }, 100, 10);
        }

        public scrollToActiveNode(): void {
            let element = this.getActiveTreeNode();
            HTMLHelpers.scrollToElement(element, this.element);
        }

        public onActiveTreeNodeChanged(callback: Function) {
            let activeNode = this.getActiveTreeNode();
            if (activeNode == null) {
                return;
            }
            let previousId = activeNode.id;
            HTMLHelpers.postponeAction(_ => {
                let activeTreeNode = this.getActiveTreeNode();
                if (activeTreeNode && activeTreeNode.id) {
                    let currentId = activeTreeNode.id;
                    return currentId.length > 0 && currentId !== previousId;
                }
                return false;
            }, _ => {
                callback();
            }, 100, 20);
        }
    }
}