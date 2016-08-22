/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeScope {
    export class ContentEditorTree {
        private classHiddenContainer: string = "sc-ext-treescope-hidden-container";
        private firstElement: HTMLDivElement;
        private nodesContainer: HTMLDivElement;

        constructor() {
            this.nodesContainer = document.querySelector("#ContentTreeActualSize") as HTMLDivElement;
            this.firstElement = (this.nodesContainer.childNodes[0]) as HTMLDivElement;
        }

        hide(): void {
            this.firstElement.classList.add(this.classHiddenContainer);
        }

        show(): void {
            this.firstElement.classList.remove(this.classHiddenContainer);
        }

        addTreeNode(nodeClode: HTMLDivElement): void {
            this.nodesContainer.appendChild(nodeClode);
        }
    }
}