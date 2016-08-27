/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource.Fields {

    export class DropLink extends DatasourceField implements IDatasourceField {
        constructor(selectElement: HTMLSelectElement) {
            super(selectElement);
        }

        public initialize() {
            this.innerElement.classList.add(this.className)
            this.innerElement.addEventListener("change", (e) => {
                this.refreshButton();
            })
            this.refreshButton();
        }
    }
}
