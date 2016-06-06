/// <reference path='../../_all.ts'/>

import IPipepineArgs = SitecoreExtensions.Pipelines.IPipepineArgs

namespace SitecoreExtensions.Modules.Launcher.Pipelines.GetCommands {
    export class GetCommandsArgs implements IPipepineArgs {
        commands: ICommand[]

        constructor() {
            this.commands = new Array<ICommand>();
        }

        registerCommands(commands: ICommand[]): void {
            commands.forEach(cmd => { this.registerCommand(cmd); });
        }

        registerCommand(command: ICommand): void {
            command.id = this.commands.length + 1;
            this.commands.push(command);
        }
    }
}

