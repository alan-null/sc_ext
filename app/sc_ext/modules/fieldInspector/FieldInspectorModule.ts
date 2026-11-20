/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FieldInspector {
    interface GetFieldIDCallback {
        (itemID: string): void;
    }

    interface GetFieldNameCallback {
        (fieldName: string): void;
    }

    enum ViewMode {
        FieldName,
        Title
    }

    class FieldNameElement {
        currentElement: HTMLSpanElement;
        highlightText: boolean;

        constructor(element: HTMLSpanElement, highlightText: boolean) {
            this.currentElement = element;
            this.highlightText = highlightText;
        }

        public setFieldName(): void {
            if (this.IsInitialized()) {
                this.setInnerHTML(this.getValue(ViewMode.FieldName));
                this.setActiveMode(ViewMode.FieldName);
                this.currentElement.classList.add("sc-ext-getfieldName-value");
                this.currentElement.classList.add("sc-ext-contentButton");

                if (this.highlightText) {
                    HTMLHelpers.selectNodeContent(this.currentElement);
                }
            }
        }

        public setFieldTitle(): void {
            if (this.IsInitialized()) {
                this.setInnerHTML(this.getValue(ViewMode.Title));
                this.setActiveMode(ViewMode.Title);
                this.currentElement.classList.remove("sc-ext-getfieldName-value");
                this.currentElement.classList.remove("sc-ext-contentButton");
            }
        }

        public setLoadingText(): void {
            if (!this.IsInitialized()) {
                let element = HTMLHelpers.createElement("span", { class: "sc-ext-getfieldName sc-ext-getfieldName-value sc-ext-contentButton" }) as HTMLSpanElement;
                element.innerHTML = "Loading ...";
                this.setInnerHTML(element.outerHTML);
            }
        }

        public resetLoadingText(): void {
            this.setInnerHTML(this.getValue(ViewMode.Title) || "");
            this.currentElement.classList.remove("sc-ext-getfieldName-value");
            this.currentElement.classList.remove("sc-ext-contentButton");
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
        classSectionInitialized: string = "sc-ext-gotofield-sections-initialized";
        classFieldNameSpan: string = "sc-ext-getfieldName";
        options: FieldInspectorOptions;
        private itemService: Http.ItemService;
        private fieldNames: { [key: string]: Promise<string> } = {};
        private resetPages: { [itemUri: string]: Promise<Document> } = {};

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
            this.options = new FieldInspectorOptions(rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.refreshControls());
            this.addTreeNodeHandlers('scContentTree');
            SitecorePageBridge.on('page:changed', () => { this.refreshControls(); });
            this.itemService = new Http.ItemService();
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
                if (sectionsRoot) {
                    sectionsRoot.classList.add(this.classSectionInitialized);
                }
            }
        }

        private insertControls(): void {
            let allFieldsLabels = document.querySelectorAll(".scEditorFieldLabel");
            for (var i = 0; i < allFieldsLabels.length; i++) {
                let label = allFieldsLabels[i] as HTMLDivElement;
                if (!this.getFirstElementWithClass(label, "scEditorSectionPanel") || label.querySelector("." + this.classFieldNameSpan)) {
                    continue;
                }
                label.dataset["scextLabel"] = ResetFieldsPage.labelText(label);
                let markerId = this.markerFieldID(label);
                if (markerId) {
                    label.dataset["fieldid"] = markerId;
                }

                let spanResetToStandardValues = HTMLHelpers.createElement("a", { class: "sc-ext-resetfield scContentButton sc-ext-contentButton" }) as HTMLSpanElement;
                let resetFieldText = "Reset Field";
                spanResetToStandardValues.innerText = resetFieldText;
                spanResetToStandardValues.onclick = () => {
                    spanResetToStandardValues.innerText = "Resetting ...";
                    let itemID = Context.ItemID(), language = Context.Language(), version = Context.Version();
                    this.resetField(label).then(() => {
                        spanResetToStandardValues.innerText = resetFieldText;
                        new PageObjects.ContentTree().loadItemVersion(itemID, language, version);
                    }, (error) => {
                        spanResetToStandardValues.innerText = resetFieldText;
                        this.notifyError("Could not reset the field.", error);
                    });
                };

                let spanGoToField = HTMLHelpers.createElement("a", { class: "sc-ext-gotofield scContentButton sc-ext-contentButton" }) as HTMLSpanElement;
                let goToFieldText = "Go to field";
                spanGoToField.innerText = goToFieldText;
                spanGoToField.onclick = (e) => {
                    spanGoToField.innerText = "Loading ...";
                    let ctrlKey = e.ctrlKey;
                    this.resolveFieldID(label).then((fieldID) => {
                        spanGoToField.innerText = goToFieldText;
                        if (ctrlKey) {
                            var url = window.top.location.origin + "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=" + fieldID;
                            new Launcher.Providers.NavigationCommand(null, null, url).execute({ ctrlKey: true, altKey: false });
                        } else {
                            new PageObjects.ContentTree().loadItem(fieldID);
                        }
                    }, (error) => {
                        spanGoToField.innerText = goToFieldText;
                        this.notifyError("Could not find the field's ID.", error);
                    });
                };

                let spanGetFieldName = HTMLHelpers.createElement("span", { class: this.classFieldNameSpan }, { default: label.innerHTML }) as HTMLSpanElement;
                spanGetFieldName.innerHTML = label.innerHTML;
                spanGetFieldName.onclick = () => {
                    let fieldNameElement = new FieldNameElement(spanGetFieldName, this.options.fieldName.highlightText);

                    if (fieldNameElement.currentElement.innerText == "Loading ...") {
                        SitecoreExtensions.Notification.Instance.info({
                            message: '<b>Field Inspector:</b></br>Fetching field name in the background.</br>Please wait.',
                            position: 'topRight', backgroundColor: 'rgba(157,222,255,0.97)', progressBar: false
                        });
                        return;
                    }

                    if (fieldNameElement.IsInitialized()) {
                        if (fieldNameElement.getMode() == ViewMode.FieldName) {
                            fieldNameElement.setFieldTitle();
                        } else {
                            fieldNameElement.setFieldName();
                        }
                        return;
                    }

                    fieldNameElement.setLoadingText();
                    this.resolveFieldID(label)
                        .then((fieldID) => this.getFieldName(fieldID))
                        .then((fieldName) => {
                            fieldNameElement.Initialize(fieldName);
                            fieldNameElement.setFieldName();
                        }, (error) => {
                            fieldNameElement.resetLoadingText();
                            this.notifyError("Could not read the field name.", error);
                        });
                };

                label.innerHTML = "";
                label.appendChild(spanGetFieldName);
                label.appendChild(spanGoToField);
                label.appendChild(spanResetToStandardValues);
            }
        };

        // Fields whose editor control carries its ID in a handler (fld={...}) need no request.
        private markerFieldID(label: HTMLElement): string {
            let marker = this.getFirstElementWithClass(label, "scEditorFieldMarker") as HTMLElement;
            if (!marker) {
                return null;
            }
            let match = /\bfld=(\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\})/i.exec(marker.innerHTML);
            return match ? match[1].toUpperCase() : null;
        }

        // The rest (dates, tree lists, rules ...) are found by their label on the item's Reset Fields page,
        // which maps every label of the editor in one request.
        private resolveFieldID(label: HTMLElement): Promise<string> {
            if (label.dataset["fieldid"]) {
                return Promise.resolve(label.dataset["fieldid"]);
            }
            return this.loadResetPage(false).then((page) => {
                this.annotateFieldIDs(ResetFieldsPage.parse(page));
                let fieldID = label.dataset["fieldid"];
                return fieldID ? Promise.resolve(fieldID) : Promise.reject<string>(new Error("The field is not listed on the Reset Fields page"));
            });
        }

        private annotateFieldIDs(entries: ResetFieldEntry[]): void {
            let labels = document.querySelectorAll(".scEditorFieldLabel[data-scext-label]");
            let texts = new Array<string>();
            for (let i = 0; i < labels.length; i++) {
                texts.push((labels[i] as HTMLElement).dataset["scextLabel"]);
            }
            let ids = ResetFieldsPage.match(texts, entries);
            for (let i = 0; i < labels.length; i++) {
                let label = labels[i] as HTMLElement;
                if (!label.dataset["fieldid"] && ids[i]) {
                    label.dataset["fieldid"] = ids[i];
                }
            }
        }

        private resetPageUrl(): string {
            return ResetFieldsPage.url(window.top.location.origin, Context.ItemID(), Context.Language(), Context.Version(), Context.Database());
        }

        private loadResetPage(fresh: boolean): Promise<Document> {
            let key = Context.GetCurrentItem();
            if (fresh || !this.resetPages[key]) {
                let page = this.requestPage(this.resetPageUrl());
                page.catch(() => { delete this.resetPages[key]; });
                this.resetPages[key] = page;
            }
            return this.resetPages[key];
        }

        private requestPage(url: string): Promise<Document> {
            return new Promise<Document>((resolve, reject) => {
                new Http.HttpRequest(url, Http.Method.GET, (e: ProgressEvent) => {
                    let request = e.currentTarget as XMLHttpRequest;
                    if (request.status !== 200) {
                        reject(new Error("Reset Fields page returned " + request.status));
                        return;
                    }
                    resolve(new DOMParser().parseFromString(request.responseText, "text/html"));
                }, () => { reject(new Error("Reset Fields page could not be loaded")); }).execute();
            });
        }

        // Posts the Reset Fields dialog back with only this field ticked, as its OK button would,
        // on a fresh copy of the page for its form state.
        private resetField(label: HTMLElement): Promise<void> {
            return this.resolveFieldID(label).then((fieldID) => {
                return this.loadResetPage(true).then((page) => {
                    let hex = ResetFieldsPage.toHex(fieldID);
                    let viewState = ResetFieldsPage.formValue(page, "__VIEWSTATE");
                    if (!page.getElementById("Reset_" + hex) || !viewState) {
                        return Promise.reject(new Error("The field is not listed on the Reset Fields page"));
                    }
                    let postData = [
                        ["__EVENTTARGET", "OK"],
                        ["__EVENTTYPE", "click"],
                        ["__CONTEXTMENU", ""],
                        ["__MODIFIED", ""],
                        ["__ISEVENT", "1"],
                        ["__CSRFTOKEN", ResetFieldsPage.formValue(page, "__CSRFTOKEN")],
                        ["__VIEWSTATE", viewState],
                        ["Reset_" + hex, "1"]
                    ].map((pair) => encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1])).join("&");

                    return new Promise<void>((resolve, reject) => {
                        new Http.HttpRequest(this.resetPageUrl(), Http.Method.POST, (e: ProgressEvent) => {
                            let status = (e.currentTarget as XMLHttpRequest).status;
                            if (status === 200) {
                                resolve();
                            } else {
                                reject(new Error("Reset Fields returned " + status));
                            }
                        }, () => { reject(new Error("Reset Fields could not be reached")); }).execute(postData);
                    });
                });
            });
        }

        // The field definition item's name, from the Sitecore Item Service.
        private getFieldName(fieldID: string): Promise<string> {
            let database = Context.Database();
            let key = database + "|" + fieldID;
            if (!this.fieldNames[key]) {
                let request = this.itemService.getItem(fieldID, { database: database, fields: ["ItemName"] })
                    .then((item) => item && item.ItemName ? item.ItemName as string : Promise.reject(new Error("No ItemName in the Item Service response")));
                request.catch(() => { delete this.fieldNames[key]; });
                this.fieldNames[key] = request;
            }
            return this.fieldNames[key];
        }

        private notifyError(message: string, error: any): void {
            let detail = error instanceof Http.ItemServiceError && error.isUnavailable()
                ? "The Sitecore Item Service (/sitecore/api/ssc) is disabled or not accessible on this instance."
                : (error && error.message) || "";
            SitecoreExtensions.Notification.Instance.warning({
                message: "<b>Field Inspector:</b></br>" + message + (detail ? "</br>" + detail : ""),
                position: 'topRight', backgroundColor: 'rgba(255,218,157,0.97)', progressBar: false
            });
        }

        private getFirstElementWithClass(parent: any, className: string): Node {
            return HTMLHelpers.getElement(parent, (e) => {
                return e.classList.contains(className);
            });
        }
    }
}
