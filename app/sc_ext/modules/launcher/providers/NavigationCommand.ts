/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export interface UserActionEvent {
        altKey: boolean;
        ctrlKey: boolean;
    }

    export class NavigationCommand implements ICommand {
        id: number;
        name: string;
        description: string;
        url: string;

        constructor(name: string, description: string, url: string) {
            this.id = 0;
            this.name = name;
            this.description = description;
            this.url = url;
        }

        private openInCurrentTab(): void {
            window.top.document.location.href = this.url;
        }

        private openInNewTab(): void {
            var virtualLink = HTMLHelpers.createElement("a", {
                target: "_blank",
                href: this.url
            }) as HTMLLinkElement;
            virtualLink.click();
        }

        canExecute(): boolean {
            return true;
        }

        execute(evt: UserActionEvent): void {
            if (evt && evt.ctrlKey) {
                this.openInNewTab();
            } else {
                this.openInCurrentTab();
            }
        }
    }
}