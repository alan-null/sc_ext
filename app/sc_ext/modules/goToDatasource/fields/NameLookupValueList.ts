/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource.Fields {
    export class NameLookupValueList extends DatasourceField implements IDatasourceField {
        previous: any;

        constructor(selectElement: HTMLSelectElement) {
            super(selectElement);
        }

        public initialize() {
            this.innerElement.classList.add(this.className);
            this.innerElement.addEventListener("change", (e) => {
                this.refreshButton();
            });
            this.refreshButton();
        }

        protected removeButton() {
            this.previous = this.getButton().nextSibling;
            super.removeButton();
        }

        protected getButtonClasses(): string[] {
            return [this.classButton, "scContentButton", this.innerElement.id];
        }

        protected generateButton(): HTMLSpanElement {
            let spanGoToDatasource = HTMLHelpers.createElement("a", {
                class: this.getButtonClasses().join(' '),
            }) as HTMLSpanElement;
            spanGoToDatasource.innerText = "Go to '" + this.getSelectedOption().textContent + "'";
            spanGoToDatasource.dataset['index'] = this.innerElement.selectedIndex.toString();
            return spanGoToDatasource;
        }

        protected insertButton(spanGoToDatasource: HTMLSpanElement) {
            if (this.previous) {
                this.destination.insertBefore(spanGoToDatasource, this.previous);
            } else {
                this.destination.appendChild(spanGoToDatasource);
            }
        }
    }
}
