/// <reference path="../../../_all.ts"/>

namespace SitecoreExtensions.Modules.ShortcutsRunner.Providers {
    import ICommand = Launcher.ICommand

    export class AppShortcutCommand implements ICommand {
        id: number;
        name: string;
        description: string;
        runner: ShortcutRunner;
        shortcutID: string;

        constructor(name, description, runner, shortcutID) {
            this.id = 0;
            this.runner = runner;
            this.name = name;
            this.description = description;
            this.shortcutID = shortcutID;
        }

        public canExecute(): boolean {
            return true;
        }

        public execute(): void {
            this.runner.runShortcutCommand(this.shortcutID);
        }
    }
}