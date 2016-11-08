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
            this.relocatePopup(1);
        }

        getIndexOfElement(elementId: string): number {
            let refreshTreeButton = this.popupElement.querySelector("table>tbody #" + elementId) as HTMLTableRowElement;
            return refreshTreeButton.rowIndex;
        }

        hide(): void {
            this.popupElement.remove();
        }

        private relocatePopup(count: number = 1): void {
            let numberOfExistingButtons = this.getNumberOfExistingButtons();
            let buttonHeight = this.popupElement.clientHeight / numberOfExistingButtons;

            let value = buttonHeight * count;
            this.popupElement.style.height = (this.parseStyleInt(this.popupElement.style.height) + value) + "px";
        }

        private getNumberOfExistingButtons(): number {
            var tbody = this.popupElement.querySelector("table>tbody");
            let numberOfExistingButtons = 0;
            [].forEach.call(tbody.childNodes, (e) => {
                if (e.id != null && e.id.length > 0) {
                    numberOfExistingButtons++;
                }
            });
            return numberOfExistingButtons;
        }

        private parseStyleInt(intWannaBe: string) {
            return parseInt(intWannaBe.replace("px", ""));
        }
    }
}