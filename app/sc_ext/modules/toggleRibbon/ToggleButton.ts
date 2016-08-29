/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ToggleRibbon {
    export class ToggleButton {
        innerElement: HTMLDivElement;
        private classHidden: string = "sc-ext-toggleRibon-hidden";

        constructor(toggleHandler: any) {
            this.innerElement = HTMLHelpers.createElement("div", { id: "sc-ext-toggleRibon-button" }) as HTMLDivElement;
            this.innerElement.onclick = () => { toggleHandler(); };
            document.body.appendChild(this.innerElement);
        }

        public updatePosition(isVisible: boolean): void {
            if (isVisible) {
                this.innerElement.style.right = '50px';
                this.innerElement.style.top = '58px';
            } else {
                this.innerElement.style.right = '0';
                this.innerElement.style.top = '0';
            }
        }

        public show() {
            this.innerElement.classList.remove(this.classHidden);
        }

        public hide() {
            this.innerElement.classList.add(this.classHidden);
        }
    }
}