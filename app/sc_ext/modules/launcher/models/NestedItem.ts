namespace SitecoreExtensions.Modules.Launcher.Models {
    export class NestedItem {
        key: string;
        title: string;
        description: string;
        icon: string;
        keepLauncherOpen: boolean;
        execute: (evt: Providers.UserActionEvent) => void;
    }
}