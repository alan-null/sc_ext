/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FieldInspector {
    interface GetFieldIDCallback {
        (itemID: string): void;
    }

    interface GetFieldNameCallback {
        (fieldNema: string): void;
    }

    enum ViewMode {
        FieldName,
        Title
    }

    class FieldNameElement {
        currentElement: HTMLSpanElement;

        constructor(element: HTMLSpanElement) {
            this.currentElement = element;
        }

        public setFieldName(): void {
            if (this.IsInitialized()) {
                this.setInnerHTML(this.getValue(ViewMode.FieldName));
                this.setActiveMode(ViewMode.FieldName);
                this.currentElement.classList.add("sc-ext-getfieldName-value");
            }
        }

        public setFieldTitle(): void {
            if (this.IsInitialized()) {
                this.setInnerHTML(this.getValue(ViewMode.Title));
                this.setActiveMode(ViewMode.Title);
                this.currentElement.classList.remove("sc-ext-getfieldName-value");
            }
        }

        public IsInitialized(): boolean {
            return this.currentElement.dataset['field'] != null;
        }

        public Initialize(fieldName: string): void {
            this.setInnerHTML(fieldName);
            this.currentElement.dataset['field'] = fieldName;
        }


        public getMode(): ViewMode {
            if (this.currentElement.dataset['active'] == "default") {
                return ViewMode.Title;
            }
            return ViewMode.FieldName;
        }

        private setActiveMode(mode: ViewMode) {
            this.currentElement.dataset['active'] = (mode == ViewMode.FieldName) ? "field" : "default";
        }

        private setInnerHTML(value: string) {
            this.currentElement.innerHTML = value;
        }

        private getValue(mode: ViewMode) {
            let fieldName = (mode == ViewMode.FieldName) ? "field" : "default";
            return this.currentElement.dataset[fieldName];
        }
    }

    export class FieldInspectorModule extends ModuleBase implements ISitecoreExtensionsModule {
        database: string;
        lang: string;
        idParser: IdParser;
        classSectionInitialized: string = "sc-ext-gotofield-sections-initialized";
        classFieldIDsInitialized: string = "sc-ext-gotofield-fieldIDs-initialized";
        classFieldNameSpan: string = "sc-ext-getfieldName";

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.refreshControls());
            this.addTreeNodeHandlers('scContentTree');
            this.database = SitecoreExtensions.Context.Database();
            this.lang = SitecoreExtensions.Context.Language();
            this.idParser = new IdParser();
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.refreshControls();
                    }, 10);
                });
            }
        }

        private refreshControls(): void {
            if (!document.querySelector("." + this.classSectionInitialized)) {
                this.insertControls();
                let sectionsRoot = document.querySelector(".scEditorSections");
                sectionsRoot.classList.add(this.classSectionInitialized);
            }
        }

        private insertControls(): void {
            let allFieldsLabels = document.querySelectorAll(".scEditorFieldLabel");
            for (var i = 0; i < allFieldsLabels.length; i++) {
                var label = allFieldsLabels[i] as HTMLDivElement;
                let sectionElement = this.getFirstElementWithClass(label, "scEditorSectionPanel").previousSibling as HTMLDivElement;


                let fieldLabels = (this.getFirstElementWithClass(label, "scEditorSectionPanelCell") as HTMLDivElement).querySelectorAll(".scEditorFieldLabel");

                for (let j = 0; j < fieldLabels.length; j++) {
                    var child = fieldLabels[j] as HTMLTableRowElement;
                    if (child.innerText == label.innerText) {
                        label.dataset["sectionid"] = sectionElement.innerText + "-" + j;

                        let spanGoToField = HTMLHelpers.createElement("a", { class: "sc-ext-gotofield scContentButton" }) as HTMLSpanElement;
                        spanGoToField.innerText = "Go to field";
                        spanGoToField.onclick = (e) => {
                            this.ensureFieldsInitialized();
                            if (e.ctrlKey) {
                                this.getFieldID(this.getActiveNodeID(), sectionElement.innerText, j, (fieldID) => {
                                    var url = window.top.location.origin + "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=" + fieldID;
                                    new Launcher.Providers.NavigationCommand(null, null, url).execute(e);
                                });

                            } else {
                                this.getFieldID(this.getActiveNodeID(), sectionElement.innerText, j, (fieldID) => {
                                    let contentTree = new PageObjects.ContentTree();
                                    contentTree.loadItem(fieldID);
                                });
                            }

                        };

                        let spanGetFieldName = HTMLHelpers.createElement("span", { class: this.classFieldNameSpan }, { default: label.innerHTML }) as HTMLSpanElement;
                        spanGetFieldName.innerHTML = label.innerHTML;
                        spanGetFieldName.onclick = (e) => {
                            let currentElement = this.getFirstElementWithClass(e.srcElement, this.classFieldNameSpan);

                            let fieldNameElement = new FieldNameElement(currentElement as HTMLSpanElement);
                            if (!fieldNameElement.IsInitialized()) {

                                let initialized = this.ensureFieldsInitialized(() => { this.writeDownFieldName(e, sectionElement, j); });
                                if (initialized) {
                                    this.writeDownFieldName(e, sectionElement, j);
                                }
                            } else {
                                if (fieldNameElement.getMode() == ViewMode.FieldName) {
                                    fieldNameElement.setFieldTitle();
                                } else {
                                    fieldNameElement.setFieldName();
                                }
                            }
                        };

                        label.innerHTML = "";
                        label.appendChild(spanGetFieldName);
                        label.appendChild(spanGoToField);
                    }
                }
            }
        };

        private ensureFieldsInitialized(callback?: any) {
            if (document.querySelector("." + this.classFieldIDsInitialized) == null) {
                this.initFieldIDs(callback);
                return false;
            }
            return true;
        }

        private getActiveNodeID(): string {
            return document.querySelector(".scContentTreeContainer .scContentTreeNodeActive").id.substring(10);
        }

        private initFieldIDs(callback?: any) {
            this.getItemFields(this.getActiveNodeID(), callback);
            let sectionsRoot = document.querySelector(".scEditorSections");
            sectionsRoot.classList.add(this.classFieldIDsInitialized);
        }

        private writeDownFieldName(e, sectionElement, j) {
            let elemenet = HTMLHelpers.getElement(e.srcElement, (e) => { return e.dataset['fieldid'] != null; }) as HTMLDivElement;
            let fieldID = elemenet.dataset['fieldid'];
            this.getFieldName(fieldID, sectionElement.innerText, j, (fieldName) => {
                let node = this.getFirstElementWithClass(e.srcElement, this.classFieldNameSpan) as HTMLDivElement;
                let currentElement = new FieldNameElement(node);
                currentElement.Initialize(fieldName);
                currentElement.setFieldName();
            });
        }

        private getFieldID(itemID: string, sectionName: string, index: number, callback: GetFieldIDCallback) {
            var request = new Http.HttpRequest(this.buildEndpointURL(itemID), Http.Method.GET, (e) => {
                var data = e.currentTarget.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");

                let allSections = doc.querySelectorAll(".FieldSection");
                let possibleSections = new Array<HTMLDivElement>();
                for (let i = 0; i < allSections.length; i++) {
                    var sectionCandidate = allSections[i] as HTMLDivElement;
                    if (sectionCandidate.innerText == sectionName) {
                        possibleSections.push(sectionCandidate);
                    }
                }

                let fieldNode = null;
                for (var j = 0; j < possibleSections.length; j++) {
                    var section = possibleSections[j];
                    let currentNode = section.parentNode as HTMLDivElement;
                    do {
                        currentNode = currentNode.nextElementSibling as HTMLDivElement;
                        index--;
                    } while (index >= 0 && currentNode.nextElementSibling.querySelector(".FieldSection") == null);
                    fieldNode = currentNode.querySelector(".FieldLabel>span>a");
                    if (fieldNode != null && index < 0) break;
                }

                let fieldID = this.idParser.extractID(fieldNode.attributes['href'].value);
                callback(fieldID);
            });
            request.execute();
        }

        private buildEndpointURL(id: string): string {
            var endpoint = window.top.location.origin + "/sitecore/admin/dbbrowser.aspx";
            return endpoint + "?db=" + this.database + "&lang=" + this.lang + "&id=" + id;
        }

        private getFieldName(fieldID: string, sectionName: string, index: number, callback: GetFieldNameCallback) {
            var request = new Http.HttpRequest(this.buildEndpointURL(fieldID), Http.Method.GET, (e) => {
                var data = e.currentTarget.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                let pathFragments = doc.querySelectorAll(".ItemPathFragment");
                let lastPathFragment = pathFragments[pathFragments.length - 1] as HTMLAnchorElement;
                let fieldName = lastPathFragment.innerText;
                callback(fieldName);
            });
            request.execute();
        }
        ;
        private getItemFields(itemID: string, callback?: any) {
            var request = new Http.HttpRequest(this.buildEndpointURL(itemID), Http.Method.GET, (e) => {
                var data = e.currentTarget.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");

                let allSections = doc.querySelector(".FieldsScroller").querySelectorAll("td.FieldSection,td.FieldLabel .ItemPathTemplate");
                let currentSection;
                for (var index = 0; index < allSections.length; ) {
                    var section = allSections[index] as HTMLTableDataCellElement;

                    if (section.className == "FieldSection") {
                        let sectionName = section.innerText.replace(" ", "_");
                        let sectionID = "Section_" + sectionName;
                        currentSection = document.querySelector(".scEditorSections [id^='" + sectionID + "']");
                        index++;
                        if (currentSection == null) {
                            break;
                        }
                    }
                    section = allSections[index] as HTMLTableDataCellElement;
                    if (section == null) {
                        break;
                    }

                    let fieldIndex = 0;

                    let getSectionID = (tempIndex: number): string => {
                        let id = currentSection.innerText + "-" + tempIndex;
                        while (document.querySelector("[data-sectionid='" + id + "']:not([data-fieldid])") == null) {
                            id = currentSection.innerText + "-" + (++tempIndex);
                        }
                        return id;
                    };

                    while (section.className == "ItemPathTemplate") {
                        let id = getSectionID(fieldIndex++);

                        let label = document.querySelector("[data-sectionid='" + id + "']") as HTMLAnchorElement;

                        label.dataset["fieldid"] = this.idParser.extractID(section.attributes['href'].value);
                        section = allSections[++index] as HTMLTableDataCellElement;
                    }
                }
                if (callback) {
                    callback();
                }
            });
            request.execute();
        }

        private getFirstElementWithClass(parent: any, className: string): Node {
            return HTMLHelpers.getElement(parent, (e) => {
                return e.classList.contains(className);
            });
        }
    }
}
