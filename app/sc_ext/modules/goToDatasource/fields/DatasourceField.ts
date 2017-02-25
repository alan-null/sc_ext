/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource.Fields {
    export class DatasourceField {
        innerElement: HTMLSelectElement;
        destination: HTMLDivElement;
        className: string = "sc-ext-goToDatasource";
        classButton: string = "sc-ext-goToDatasource-button";
        idParser: IdParser;

        constructor(selectElement: HTMLSelectElement) {
            this.innerElement = selectElement;
            this.idParser = new IdParser();
            this.destination = this.getLinkDestination();
        }

        protected getOptions(): Array<HTMLOptionElement> {
            let result = Array<HTMLOptionElement>();
            for (var index = 0; index < this.innerElement.childNodes.length; index++) {
                var node = this.innerElement.childNodes[index];
                result.push(node as HTMLOptionElement);
            }
            return result;
        }

        protected getSelectedOption(): HTMLOptionElement {
            return this.getOptions()[this.innerElement.selectedIndex];
        }

        protected getSelectedValue(): string {
            let option = this.getSelectedOption();
            if (option) {
                return option.value;
            }
            return null;
        }

        protected getLinkDestination() {
            let wrapper = HTMLHelpers.getElement(this.innerElement, (n) => {
                return n.classList.contains('scEditorFieldMarkerInputCell');
            });
            let destination = wrapper.querySelector(".scEditorFieldLabel") as HTMLDivElement;
            return destination;
        }

        protected buttonExists(): boolean {
            if (this.getButton()) {
                return true;
            }
            return false;
        }

        protected getButtonClasses(): string[] {
            return [this.classButton, "scContentButton"];
        }

        protected getButton(): HTMLDivElement {
            let buttonSelector = "." + this.getButtonClasses().join('.');
            return this.destination.querySelector(buttonSelector) as HTMLDivElement;
        }


        protected removeButton() {
            let button = this.getButton();
            if (button) {
                button.remove();
            }
        }

        protected refreshButton() {
            if (this.buttonExists()) {
                this.removeButton();
            }
            this.appendButton();
        }

        protected generateButton(): HTMLSpanElement {
            let spanGoToDatasource = HTMLHelpers.createElement("a", {
                class: this.getButtonClasses().join(' ')
            }) as HTMLSpanElement;
            spanGoToDatasource.innerText = "Go to datasource";
            return spanGoToDatasource;
        }

        protected appendButton() {
            let selectedValue = this.getSelectedValue();
            if (selectedValue) {
                let id = this.idParser.extractID(selectedValue);
                let spanGoToDatasource = this.generateButton();
                spanGoToDatasource.onclick = (e) => {
                    let id = this.idParser.extractID(selectedValue);
                    if (e.ctrlKey) {
                        var url = window.top.location.origin + "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=" + id;
                        new Launcher.Providers.NavigationCommand(null, null, url).execute(e);
                    } else {
                        let contentTree = new PageObjects.ContentTree();
                        contentTree.loadItem(id);
                    }
                };
                this.insertButton(spanGoToDatasource);
            }
        }

        protected insertButton(spanGoToDatasource: HTMLSpanElement) {
            this.destination.appendChild(spanGoToDatasource);
        }
    }
}
