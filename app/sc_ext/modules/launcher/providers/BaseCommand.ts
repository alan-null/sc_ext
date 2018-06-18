/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export abstract class BaseCommand implements ICommand {
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

        abstract canExecute();

        abstract execute(evt: UserActionEvent);
    }
}