/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export abstract class BaseCommandsProvider implements ICommandsProvider {
        commands: ICommand[];

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }
        getCommands(): ICommand[] {
            return this.commands;
        }

        abstract createCommands();

        addInvokeCommand(name: string, description: string, command: string, canExecute: Function): void {
            var cmd: ICommand = {
                id: 0,
                name: name,
                description: description,
                execute: () => { scForm.invoke(command); },
                canExecute: canExecute
            };
            this.commands.push(cmd);
        }
    }
}