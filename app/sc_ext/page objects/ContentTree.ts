/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.PageObjects {

    export class ContentTree {
        private element: HTMLElement;

        constructor() {
            this.element = document.getElementById("ContentTreeInnerPanel");
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
    }
}