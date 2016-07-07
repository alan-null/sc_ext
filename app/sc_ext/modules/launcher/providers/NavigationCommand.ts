/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
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
            window.open(this.url,'_newtab');
        }

        canExecute(): boolean {
            return true;
        }

        execute(evt: KeyboardEvent): void {
            if (evt && evt.ctrlKey) {
                this.openInNewTab();
            } else {
                this.openInCurrentTab();
            }
        }
    }
}