/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.HeaderQuickInfoExtender {
    export class HeaderQuickInfoExtenderModule extends ModuleBase implements ISitecoreExtensionsModule {
        className: string = "sc-ext-quickInfoExtender";

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            window.addEventListener('load', () => this.refreshButtons());
            SitecorePageBridge.on('page:changed', () => { this.refreshButtons(); });
            this.observeQuickInfo();
        }

        private refreshButtons(): void {
            let quickInfo = document.getElementsByClassName("scEditorQuickInfo")[0];
            if (!quickInfo) {
                return;
            }
            let rows = quickInfo.getElementsByTagName("tr");
            [0, 3, 4].forEach((index) => {
                if (rows[index]) {
                    this.addButtons(rows[index]);
                }
            });
        }

        private observeQuickInfo(): void {
            if (!document.body || typeof MutationObserver == "undefined") {
                return;
            }
            new MutationObserver((mutations) => {
                let quickInfo = document.getElementsByClassName("scEditorQuickInfo")[0];
                for (let i = 0; i < mutations.length; i++) {
                    let mutation = mutations[i];
                    if (quickInfo && quickInfo.contains(mutation.target)) {
                        this.refreshButtons();
                        return;
                    }
                    for (let j = 0; j < mutation.addedNodes.length; j++) {
                        let node = mutation.addedNodes[j] as Element;
                        if (node.nodeType == 1 && (node.classList.contains("scEditorQuickInfo") || node.querySelector(".scEditorQuickInfo"))) {
                            this.refreshButtons();
                            return;
                        }
                    }
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        private addButtons(tr: Element): void {
            const svgCopy = `<svg class="sc-ext-quickInfoExtender-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"></path></svg>`;
            const svgNavigate = `<svg class="sc-ext-quickInfoExtender-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="m432,320l-32,0c-13.3,0 -24,10.7 -24,24l1.25,54.70943c0,13.3 -3.43647,32.81759 -16.73647,32.81759l-280.92908,0.16892c-15.175,-0.625 -32.63175,-4.39933 -32.63175,-17.69933l1.0473,-277.99661c0,-13.3 10.7,-24 24,-24l104,0c13.3,0 24,-10.7 24,-24l0,-32c0,-13.3 -10.7,-24 -24,-24l-104,0c-39.8,0 -72,32.2 -72,72l0,304c0,39.8 32.2,72 72,72l280,0c39.8,0 72,-32.2 72,-72l0,-64c0,-13.3 -10.7,-24 -24,-24l32,0zm-32,-320l-92,0c-29.5,0 -43.8,35.7 -23.2,56.3l36.6,35.7l-132.7,132.7c-9.4,9.4 -9.4,24.6 0,33.9l22.6,22.6c9.4,9.4 24.6,9.4 33.9,0l132.8,-132.6l35.7,35.7c20.5,20.5 56.3,6.2 56.3,-23.2l0,-137.1c0,-13.3 -10.7,-24 -24,-24l-46,0z"/></svg>`;

            let idInput = tr.querySelector('input') as HTMLInputElement;
            if (idInput == null) {
                // no ID no buttons
                return;
            }
            let itemId = idInput.value;

            let columns = tr.querySelectorAll("td");
            if (columns.length < 2) {
                return;
            }
            let column2nd = columns[1] as HTMLElement;
            if (column2nd.getElementsByClassName(this.className).length != 0) {
                return;
            }

            let wrapper = HTMLHelpers.createElement("div", { class: this.className }) as HTMLDivElement;
            wrapper.dataset['itemId'] = itemId;
            wrapper.innerHTML = column2nd.innerHTML;

            // copy button
            wrapper.appendChild(this.createIconButton(svgCopy, (e) => this.copyId(e)));

            // navigate to button
            if (Context.ItemID() != itemId) {
                wrapper.appendChild(this.createIconButton(svgNavigate, (e) => this.navigateToItem(e)));
            }

            column2nd.innerHTML = '';
            column2nd.appendChild(wrapper);
        }

        private createIconButton(svg: string, onclick: (e: MouseEvent) => void): HTMLSpanElement {
            let container = HTMLHelpers.createElement("span") as HTMLSpanElement;
            container.innerHTML = svg;

            let icon = container.firstElementChild;
            if (icon != null) {
                icon.setAttribute("pointer-events", "none");
            }

            container.onclick = onclick;
            return container;
        }

        private copyId(evt: MouseEvent): void {
            let idHolder = HTMLHelpers.getElement(evt.getSrcElement(), (n) => {
                return n.classList.contains(this.className);
            });

            let id = this.getId(evt);
            HTMLHelpers.copyTextToClipboard(id);

            SitecoreExtensions.Notification.Instance.info({
                message: `<b>QuickInfo Extender:</b></br>ID: <code>${id}</code></br>copied to the clipboard`,
                position: 'topRight', backgroundColor: 'rgba(157,222,255,0.97)', progressBar: false
            });
        }

        private navigateToItem(evt: MouseEvent): void {
            scForm.postRequest("", "", "", "LoadItem(\"" + this.getId(evt) + "\")");
        }

        private getId(evt: MouseEvent): string {
            return HTMLHelpers.getElement(evt.getSrcElement(), (n) => {
                return n.classList.contains(this.className);
            }).dataset['itemId'];
        }
    }
}
