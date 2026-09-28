/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export interface UserActionEvent {
        altKey: boolean;
        ctrlKey: boolean;
    }

    export class NavigationCommand extends BaseCommand implements ICommand {
        constructor(name: string, description: string, url: string) {
            super(name, description, url);
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

        private openInCurrentTab(): void {
            window.top.document.location.href = this.url;
        }

        private openInNewTab(): void {
            if (typeof chrome != "undefined" && chrome.runtime) {
                chrome.runtime.sendMessage({
                    sc_ext_openTab_request: true,
                    url: this.url,
                    active: false
                });
                return;
            }

            var virtualLink = HTMLHelpers.createElement("a", {
                target: "_blank",
                href: this.url
            }) as HTMLLinkElement;
            virtualLink.click();
        }
    }
}