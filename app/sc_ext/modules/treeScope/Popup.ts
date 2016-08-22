/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeScope {
    export class Popup {
        popupElement: HTMLDivElement;
        constructor(innerElement: HTMLDivElement) {
            this.popupElement = innerElement;
        }

        appendPopupButton(button: PopupButton, index: number = 0) {
            var tbody = this.popupElement.querySelector("table>tbody");
            let newTr = (tbody.parentNode as HTMLTableElement).insertRow(index);
            newTr.parentNode.replaceChild(button.renderButton(), newTr);
            this.relocatePopup(this.popupElement, 1);
        }

        getIndexOfElement(elementId: string): number {
            let refreshTreeButton = this.popupElement.querySelector("table>tbody #" + elementId) as HTMLTableRowElement;
            return refreshTreeButton.rowIndex;
        }

        hide(): void {
            this.popupElement.remove();
        }

        private relocatePopup(popup: HTMLDivElement, count: number = 1): void {
            let buttonHeight = 26;
            let value = buttonHeight * count;
            popup.style.height = (this.parseStyleInt(popup.style.height) + value) + "px";
            popup.style.top = (this.parseStyleInt(popup.style.top) - value) + "px";
        }

        private parseStyleInt(intWannaBe: string) {
            return parseInt(intWannaBe.replace("px", ""));
        }
    }
}