/// <reference path='../../page/PageBridge.page.ts'/>

// Main world half of the Placeholder module.
namespace ScExtPage.PlaceholderAgent {
    var initKey = 'sc_ext_initialized';
    var watching = false;

    function pageModes(): any {
        var sitecore = window['Sitecore'];
        return sitecore && sitecore.PageModes;
    }

    function getPlaceholderId(chrome: any): string {
        var element = chrome._originalDOMElement;
        if (!element) {
            return '';
        }
        if (element.length === 1 && element[0].attributes && element[0].attributes.key) {
            return element[0].attributes.key.value || '';
        }
        if (element.context && element.context.attributes && element.context.attributes.key) {
            return element.context.attributes.key.value || '';
        }
        return '';
    }

    function addCommands(): void {
        var placeholders = pageModes().DesignManager.placeholders();
        Array.prototype.forEach.call(placeholders, function (chrome: any) {
            if (!chrome.data || chrome.data[initKey] != null) {
                return;
            }
            var placeholderId = getPlaceholderId(chrome);
            chrome.data.commands.push({
                click: "window.postMessage({sc_ext_page_call:true,target:'placeholder',method:'remove',args:["
                    + JSON.stringify(placeholderId) + "]}, '*')",
                header: 'Remove',
                icon: '/temp/iconcache/office/16x16/delete.png',
                disabledIcon: '/temp/add_disabled16x16.png',
                isDivider: false,
                tooltip: "Remove all renderings from the '" + placeholderId + "' placeholder.",
                type: ''
            });
            chrome.data[initKey] = true;
        });
    }

    ScExtPage.register('placeholder', {
        initialize: function () {
            var modes = pageModes();
            if (!modes || !modes.DesignManager || !modes.ChromeManager) {
                return;
            }
            if (!watching) {
                ScExtPage.proxy(modes.ChromeManager, 'resetChromes', addCommands);
                watching = true;
            }
            addCommands();
        },

        remove: function (placeholderId: string) {
            if (typeof placeholderId !== 'string') {
                return;
            }
            var sitecore = window['Sitecore'];
            var placeholder = Array.prototype.filter.call(sitecore.PageModes.DesignManager.placeholders(), function (chrome: any) {
                return chrome.isEnabled() && getPlaceholderId(chrome) === placeholderId;
            })[0];

            if (!placeholder) {
                return;
            }

            Array.prototype.forEach.call(placeholder.getChildChromes(), function (renderingChrome: any) {
                placeholder.type.deleteControl(renderingChrome);
            });

            Array.prototype.forEach.call(sitecore.LayoutDefinition.getRenderings(), function (rendering: any) {
                var renderingPlaceholder = rendering['@ph'];
                var uniqueId = rendering['@uid'];
                if (renderingPlaceholder && uniqueId && renderingPlaceholder.indexOf(placeholderId) !== -1) {
                    sitecore.LayoutDefinition.remove(uniqueId.replace(/[-{}]/g, ''));
                }
            });
        }
    });
}
