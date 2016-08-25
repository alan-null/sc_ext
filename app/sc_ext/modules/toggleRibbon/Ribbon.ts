/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ToggleRibbon {
    export class Ribbon {
        private nodeRibbon: HTMLDivElement;
        private classHidden: string = "sc-ext-toggleRibon-hidden";

        constructor() {
            this.nodeRibbon = top.window.document.querySelector("#scWebEditRibbon") as HTMLDivElement;
        }

        public show() {
            let nodeContainer = this.getContainerNode();
            nodeContainer.classList.remove(this.classHidden);
            this.nodeRibbon.classList.remove(this.classHidden);
        }

        public hide() {
            let nodeContainer = this.getContainerNode();
            nodeContainer.classList.add(this.classHidden)
            this.nodeRibbon.classList.add(this.classHidden);
        }

        private getContainerNode(): HTMLDivElement {
            return (top.window.document.querySelector("#scCrossPiece") as HTMLDivElement);
        }

        public isInitialized(): boolean {
            return this.getContainerNode() != null;
        }
    }
}