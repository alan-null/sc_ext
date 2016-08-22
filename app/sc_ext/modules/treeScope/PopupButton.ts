/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeScope {
    export class PopupButton {
        activeNodeID: string;
        buttonClass: string;

        iconImage: string;
        captionText: string;
        hotkeyImage: string;

        clickCallback: PopupButtonClickCallback;

        constructor(activeNodeID: string, clickCallback: PopupButtonClickCallback) {
            this.activeNodeID = activeNodeID;

            this.iconImage = "/sitecore/images/blank.gif";
            this.captionText = "";
            this.iconImage = "/sitecore/images/blank.gif";

            this.clickCallback = clickCallback;
        }

        renderButton(): HTMLTableRowElement {
            let defaultEvent = "javascript:return scForm.rollOver(this,event)";
            let tr = HTMLHelpers.createElement("tr", {
                onmouseover: defaultEvent,
                onfocus: defaultEvent,
                onmouseout: defaultEvent,
                onblur: defaultEvent,
                class: this.buttonClass
            }) as HTMLTableRowElement;

            tr.onclick = () => {
                this.clickCallback(this.activeNodeID);
            };

            let tdIcon = HTMLHelpers.createElement("td", { class: "scMenuItemIcon" }) as HTMLTableDataCellElement;
            let tdIconImg = HTMLHelpers.createElement("img", { src: this.iconImage, width: "16", height: "16", align: "middle", class: "", alt: "", border: "0" }) as HTMLImageElement;
            tdIcon.appendChild(tdIconImg);

            let tdCaption = HTMLHelpers.createElement("td", { class: "scMenuItemCaption" }) as HTMLTableDataCellElement;
            tdCaption.textContent = this.captionText;

            let tdHotkey = HTMLHelpers.createElement("td", { class: "scMenuItemHotkey" }) as HTMLTableDataCellElement;
            let tdHotkeyImg = HTMLHelpers.createElement("img", { src: this.hotkeyImage, width: "1", height: "1", class: "scSpacer", alt: "", border: "0" }) as HTMLImageElement;
            tdHotkey.appendChild(tdHotkeyImg);

            tr.appendChild(tdIcon);
            tr.appendChild(tdCaption);
            tr.appendChild(tdHotkey);

            return tr;
        }
    }
}