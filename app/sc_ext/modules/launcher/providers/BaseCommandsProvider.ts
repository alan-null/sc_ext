/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export abstract class BaseCommandsProvider implements ICommandsProvider {
        commands: ICommand[];
        private shortcutRunner: ShortcutsRunner.ShortcutRunner;

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }
        getCommands(): ICommand[] {
            return this.commands;
        }

        abstract createCommands();

        addInvokeCommand(name: string, description: string, command: string, canExecute: Function, shortcutId?: string): void {
            var cmd: ICommand = {
                id: 0,
                name: name,
                description: description,
                execute: (evt: UserActionEvent) => {
                    if (shortcutId && evt && evt.ctrlKey) {
                        if (!this.shortcutRunner) {
                            this.shortcutRunner = new ShortcutsRunner.ShortcutRunner();
                        }
                        this.shortcutRunner.runShortcutCommand(shortcutId, evt as KeyboardEvent);
                    } else {
                        scForm.invoke(command);
                    }
                },
                canExecute: canExecute
            };
            this.commands.push(cmd);
        }
    }
}