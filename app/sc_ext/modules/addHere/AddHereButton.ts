/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.AddHere {
    export class AddHereButton {
        classButtonInitialized: string = "sc-ext-addHere-button-initialized";
        innerElement: HTMLDivElement;
        textElement: HTMLSpanElement;
        placeholderName: string;
        constructor(innerElement: HTMLDivElement) {
            this.innerElement = innerElement;
            this.textElement = this.innerElement.nextElementSibling.firstChild as HTMLSpanElement;
            this.placeholderName = this.innerElement.parentElement.title.match(/'.*'/)[0].replace(/'/g, "");
            this.innerElement.classList.add(this.classButtonInitialized);
        }

        public setText(text: string) {
            this.textElement.innerText = text;
        }

        public getText(): string {
            return this.textElement.innerText;
        }
    }
}