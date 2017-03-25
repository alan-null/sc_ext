/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>
/// <reference path='../options/providers/OptionsProvider.ts'/>
/// <reference path='../common/_all.ts'/>

'use strict';

window.addEventListener('message', function (event) {
    var Communication = SitecoreExtensions.Common.Communication;
    var OptionsProvider = SitecoreExtensions.Options.OptionsProvider;

    let parser = new Communication.DataParser();
    let instance = parser.tryParse(event.data);

    if (instance instanceof Communication.GetOptionsRequestMessage) {
        let response = new Communication.GetOptionsResponseMessage();
        if (chrome.storage) {
            var provider = new OptionsProvider();
            provider.getOptions((result: SitecoreExtensions.Options.OptionsWrapper) => {
                response.optionsWrapper = result;
                window.postMessage(response, '*');
            });
        } else {
            window.postMessage(response, '*');
        }
    }

    if (instance instanceof Communication.GetModuleOptionsRequestMessage) {
        let response = new Communication.GetModuleOptionsResponseMessage();
        if (chrome.storage) {
            let moduleName = instance.moduleName;
            var provider = new OptionsProvider();
            provider.getModuleOptions(moduleName, (result: SitecoreExtensions.Options.IModuleOptions) => {
                response.moduleOptions = result;
                window.postMessage(response, '*');
            });
        } else {
            window.postMessage(response, '*');
        }
    }

    if (instance instanceof Communication.SetOptionsRequestMessage) {
        if (chrome.storage) {
            var provider = new OptionsProvider();
            provider.setOptions(instance.options, () => { });
        }
    }

    if (instance instanceof Communication.SetModuleOptionsRequestMessage) {
        if (chrome.storage) {
            let moduleOptions = instance.moduleOptions;
            var provider = new OptionsProvider();
            provider.setModuleOptions(moduleOptions);
        }
    }

    if (event.data.sc_ext_enabled) {
        if (event.data.sc_ext_seticon_request) {
            chrome.runtime.sendMessage({
                newIconPath: 'chrome/images/icon-128.png',
                modulesCount: event.data.sc_ext_badgetext
            });
        }
    }
});

function createScriptElement(src: string): HTMLScriptElement {
    var script = <HTMLScriptElement>document.createElement("script");
    script.src = chrome.extension.getURL(src);
    return script;
}

function injectScripts(scripts: HTMLScriptElement[]) {
    if (scripts.length > 0) {
        var otherScripts = scripts.slice(1);
        var script = scripts[0];
        var onload = function () {
            script.parentNode.removeChild(script);
            injectScripts(otherScripts);
        };
        if (script.src != "") {
            script.onload = onload;
            document.head.appendChild(script);
        } else {
            document.head.appendChild(script);
            onload();
        }
    }
}

injectScripts([
    createScriptElement("/common/optionsProvider.js"),
    createScriptElement("/sc_ext/Application.js"),
]);