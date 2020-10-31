/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Placeholder {
    export interface IPlaceholderCommand {
        click: string;
        header: string;
        icon: string;
        disabledIcon: string;
        isDivider: boolean;
        tooltip: string;
        type: string;
    }
}