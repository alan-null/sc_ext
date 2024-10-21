/// <reference path='../../../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../../options/providers/OptionsProvider.ts'/>
/// <reference path='../../../options/models/LinkItem.ts'/>


'use strict';

document.getElementById('go-to-options').addEventListener('click', function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("options/options.html") });
});
document.getElementById('version').textContent = "v." + chrome.runtime.getManifest().version;

import LinkItem = SitecoreExtensions.Options.LinkItem;

class LinkItemViewModel extends LinkItem {
    constructor(linkItem: LinkItem) {
        super(linkItem.name, linkItem.url, linkItem.mode, linkItem.order);
    }

    public renderElement(): HTMLLIElement {
        let elLi = document.createElement("li") as HTMLLIElement;

        let elIcon = document.createElement('i');
        elIcon.innerHTML = '&#xe800;';
        elIcon.setAttribute("class", "fa icon-link");

        let elLinkName = document.createElement("span") as HTMLSpanElement;
        elLinkName.textContent = this.name;

        let elAnchor = document.createElement("a") as HTMLAnchorElement;
        elAnchor.setAttribute("href", "#");
        elAnchor.appendChild(elIcon);
        elAnchor.appendChild(elLinkName);

        elLi.appendChild(elAnchor);

        let url = this.url;
        let mode = this.mode;
        elLi.onclick = () => {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                let tab = tabs[0];
                if (!url.startsWith('http')) {
                    var tablink = tab.url;
                    var origin = tablink.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[0];
                    let connector = url.startsWith('/') ? "" : '/';
                    url = origin + connector + url;
                }
                if (mode == 'newtab') {
                    chrome.tabs.create({ url: url });
                } else {
                    chrome.tabs.update(tab.id, { url: url });
                }
            });
        };
        return elLi;
    }
}


chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var tabId = tabs[0].id as number;
    chrome.tabs.sendMessage(tabId, { sc_ext_getStatusInfo: true, }, (response) => {
        const statusInformation = document.querySelector('#status-information') as Element;
        if (response == undefined) {
            statusInformation.remove();
            return;
        }

        let modulesSpan = document.getElementById('sc_ext_modules_count') as HTMLSpanElement;
        let commandsSpan = document.getElementById('sc_ext_commands_count') as HTMLSpanElement;

        modulesSpan.innerHTML = response.data.modules_count;
        commandsSpan.innerHTML = response.data.commands_count;
        statusInformation.classList.remove("no-data");
    });
});

new SitecoreExtensions.Options.OptionsProvider().getModuleOptions("Links", (options: SitecoreExtensions.Options.IModuleOptions) => {
    let links = options.model as Array<LinkItem>;
    links = links.sort((a: LinkItem, b: LinkItem) => a.order - b.order);

    let linkListNode = document.getElementById('links');
    for (let index = 0; index < links.length; index++) {
        let viewModel = new LinkItemViewModel(links[index]);
        let linkElement = viewModel.renderElement();
        linkListNode.appendChild(linkElement);
    }
});