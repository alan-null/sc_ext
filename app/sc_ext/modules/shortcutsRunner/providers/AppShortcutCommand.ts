/// <reference path="../../../_all.ts"/>

namespace SitecoreExtensions.Modules.ShortcutsRunner.Providers {
    import ICommand = Launcher.ICommand

    export class AppShortcutCommand implements ICommand {
        id: number;
        name: string;
        description: string;
        runner: ShortcutRunner;
        shortcutID: string;

        constructor(name: string, description: string, runner: ShortcutRunner, shortcutID: string) {
            this.id = 0;
            this.runner = runner;
            this.name = name;
            this.description = description;
            this.shortcutID = shortcutID;
        }

        public canExecute(): boolean {
            return true;
        }

        public execute(evt?: KeyboardEvent): void {
            this.runner.runShortcutCommand(this.shortcutID, evt);
        }
    }
}