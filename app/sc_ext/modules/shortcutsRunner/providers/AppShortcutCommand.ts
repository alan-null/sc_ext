/// <reference path="../../../_all.ts"/>

namespace SitecoreExtensions.Modules.ShortcutsRunner.Providers {
    import ICommand = Launcher.ICommand;

    export class AppShortcutCommand extends Launcher.Providers.BaseCommand implements ICommand {
        runner: ShortcutRunner;
        shortcutID: string;

        constructor(name: string, description: string, runner: ShortcutRunner, shortcutID: string) {
            super(name, description, "");
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