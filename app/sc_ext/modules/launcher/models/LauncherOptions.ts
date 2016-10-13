/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Models {
    export class LauncherOptions extends Options.ModuleOptions {
        keyBindings: {
            show: number,
            hide: number,
            selectNextResult: number,
            selectPrevResult: number,
            executeCommand: number,
            selectFirstResult: number,
            selectLastResult: number,
        } = {
            show: 32,
            hide: 27,
            selectNextResult: 40,
            selectPrevResult: 38,
            executeCommand: 13,
            selectFirstResult: 33,
            selectLastResult: 34
        };

        searchResultsCount: number = 8;

        constructor(wrapper: any) {
            super();
            if (wrapper != null) {
                this.enabled = wrapper.model.enabled;
                this.keyBindings.show = wrapper.model.keyBindings.show;
                this.keyBindings.hide = wrapper.model.keyBindings.hide;
                this.keyBindings.selectNextResult = wrapper.model.keyBindings.selectNextResult;
                this.keyBindings.selectPrevResult = wrapper.model.keyBindings.selectPrevResult;
                this.keyBindings.executeCommand = wrapper.model.keyBindings.executeCommand;
                this.keyBindings.selectFirstResult = wrapper.model.keyBindings.selectFirstResult;
                this.keyBindings.selectLastResult = wrapper.model.keyBindings.selectLastResult;
                this.searchResultsCount = wrapper.model.searchResultsCount;
            };
        }
    }
}

