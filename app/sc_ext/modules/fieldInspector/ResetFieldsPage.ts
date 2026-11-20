namespace SitecoreExtensions.Modules.FieldInspector {
    export interface ResetFieldEntry {
        id: string;
        label: string;
    }

    // The Reset Fields dialog (default.aspx?xmlcontrol=ResetFields) draws every field of an item with a
    // "Reset_<field ID without dashes>" checkbox beside the same label the Content Editor shows. One request
    // therefore maps every Content Editor label to its field ID, which DB Browser used to provide.
    export class ResetFieldsPage {
        public static url(origin: string, itemID: string, language: string, version: string, database: string): string {
            return origin + "/sitecore/shell/default.aspx?xmlcontrol=ResetFields"
                + "&id=" + encodeURIComponent(itemID)
                + "&la=" + encodeURIComponent(language || "")
                + "&vs=" + encodeURIComponent(version || "")
                + "&db=" + encodeURIComponent(database || "");
        }

        public static toGuid(hex: string): string {
            let match = /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/i.exec(hex);
            return match ? ("{" + match.slice(1).join("-") + "}").toUpperCase() : null;
        }

        public static toHex(id: string): string {
            return (id || "").replace(/[{}-]/g, "").toUpperCase();
        }

        // A label's own text, without the buttons and links add-ons put in it (ours: Go to field, Reset Field).
        public static labelText(element: Element): string {
            if (!element) {
                return "";
            }
            let text = "";
            for (let i = 0; i < element.childNodes.length; i++) {
                let node = element.childNodes[i] as Element;
                if (node.nodeType === 1 && (node.tagName === "A" || node.tagName === "BUTTON")) {
                    continue;
                }
                text += node.textContent || "";
            }
            return ResetFieldsPage.normalize(text);
        }

        public static normalize(text: string): string {
            return (text || "").replace(/\s+/g, " ").trim().replace(/\s*:$/, "");
        }

        // Looser key for a second pass: no "[shared]" style suffixes, required markers or case.
        public static looseKey(text: string): string {
            return ResetFieldsPage.normalize((text || "").replace(/\s*-?\s*\[[^\]]*\]/g, "").replace(/\*/g, "")).toLowerCase();
        }

        public static parse(doc: Document): ResetFieldEntry[] {
            let entries = new Array<ResetFieldEntry>();
            let boxes = doc.querySelectorAll("input[id^='Reset_']");
            for (let i = 0; i < boxes.length; i++) {
                let box = boxes[i] as HTMLInputElement;
                let id = ResetFieldsPage.toGuid(box.id.substring("Reset_".length));
                if (!id) {
                    continue;
                }
                entries.push({ id: id, label: ResetFieldsPage.entryLabel(doc, box) });
            }
            return entries;
        }

        public static formValue(doc: Document, name: string): string {
            let inputs = doc.getElementsByName(name);
            for (let i = 0; i < inputs.length; i++) {
                let value = (inputs[i] as HTMLInputElement).value;
                if (value) {
                    return value;
                }
            }
            return "";
        }

        // Pairs each label with an entry: the k-th label with some text gets the k-th entry with that text.
        // Exact text first, then the loose key for whatever is left. Unmatched labels get null.
        public static match(labels: string[], entries: ResetFieldEntry[]): string[] {
            let result = labels.map((): string => null);
            let used = entries.map(() => false);
            let pass = (key: (text: string) => string) => {
                for (let i = 0; i < labels.length; i++) {
                    if (result[i] != null) {
                        continue;
                    }
                    let wanted = key(labels[i]);
                    if (!wanted) {
                        continue;
                    }
                    for (let j = 0; j < entries.length; j++) {
                        if (!used[j] && key(entries[j].label) === wanted) {
                            used[j] = true;
                            result[i] = entries[j].id;
                            break;
                        }
                    }
                }
            };
            pass(ResetFieldsPage.normalize);
            pass(ResetFieldsPage.looseKey);
            return result;
        }

        private static entryLabel(doc: Document, box: HTMLInputElement): string {
            let marker = ResetFieldsPage.closest(box, (e) => e.classList && e.classList.contains("scEditorFieldMarker"));
            if (marker) {
                let label = marker.querySelector(".scEditorFieldLabel");
                if (label) {
                    return ResetFieldsPage.labelText(label);
                }
            }
            let forLabel = doc.querySelector("label[for='" + box.id + "']");
            if (forLabel) {
                return ResetFieldsPage.labelText(forLabel);
            }
            let row = ResetFieldsPage.closest(box, (e) => e.tagName === "TR");
            return row ? ResetFieldsPage.labelText(row) : "";
        }

        private static closest(element: Element, predicate: (e: Element) => boolean): Element {
            let node = element.parentElement;
            while (node) {
                if (predicate(node)) {
                    return node;
                }
                node = node.parentElement;
            }
            return null;
        }
    }
}
