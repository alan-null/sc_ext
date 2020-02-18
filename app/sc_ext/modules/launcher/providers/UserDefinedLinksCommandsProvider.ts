/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    class UserDefinedLink extends NavigationCommand implements ICommand {
        constructor(name: string, description: string, url: string) {
            if (!url.startsWith('http')) {
                let connector = url.startsWith('/') ? "" : '/';
                url = window.top.location.origin + connector + url;
            }
            super(name, description, url);
        }
    }

    export class UserDefinedLinksCommandsProvider implements ICommandsProvider {
        commands: ICommand[];
        links: SitecoreExtensions.Options.LinkItem[];

        constructor(rawOptions: Options.ModuleOptionsBase) {
            this.commands = Array<ICommand>();
            if (rawOptions) {
                this.links = rawOptions.model;
                this.createCommands();
            }
        }

        createCommands(): void {
            for (var index = 0; index < this.links.length; index++) {
                var link = this.links[index];
                this.addCommand(link.name, link.url, link.url);
            }
        }

        addCommand(name: string, description: string, url: string): void {
            this.commands.push(new UserDefinedLink(name, description, url));
        }

        getCommands(): ICommand[] {
            return this.commands;
        }
    }
}