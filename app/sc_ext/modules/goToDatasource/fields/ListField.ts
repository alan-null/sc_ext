/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource.Fields {
    export class ListField extends DatasourceField implements IDatasourceField {
        constructor(selectElement: HTMLSelectElement) {
            super(selectElement);
        }

        public initialize() {
            this.innerElement.classList.add(this.className);

            this.innerElement.addEventListener("change", (e) => {
                this.refreshButton();
            });

            let options = this.getOptions();
            for (let k = 0; k < options.length; k++) {
                options[k].addEventListener("dblclick", () => {
                    let oldVal = this.getSelectedValue();
                    HTMLHelpers.postponeAction(() => {
                        return this.getSelectedValue() != oldVal;
                    }, () => {
                        this.refreshButton();
                    }, 10, 10);
                });
            }

            this.destination.parentElement.querySelectorAll(".scNavButton")[1].addEventListener("click", () => {
                this.refreshButton();
            });
        }
    }
}
