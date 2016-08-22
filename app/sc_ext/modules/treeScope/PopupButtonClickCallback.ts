/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeScope {
    export interface PopupButtonClickCallback {
        (activeNodeID: string): void;
    }
}