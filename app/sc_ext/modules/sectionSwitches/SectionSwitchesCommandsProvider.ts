/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.SectionSwitches {
    import ICommand = SitecoreExtensions.Modules.Launcher.ICommand;

    export class SectionSwitchesCommandsProvider implements Launcher.Providers.ICommandsProvider {
        commands: ICommand[];
        constructor() {
            this.commands = new Array<ICommand>();
            this.initCommands();
        }

        initCommands(): void {
            var cmd1: ICommand = {
                id: 0,
                name: 'Open sections',
                description: 'Open all closed sections',
                execute: SectionSwitches.SectionSwitchesModule.prototype.openClosedSections,
                canExecute: () => { return Context.Location() == Enums.Location.ContentEditor; }
            };
            var cmd2: ICommand = {
                id: 0,
                name: 'Close sections',
                description: 'Close all opened sections',
                execute: SectionSwitches.SectionSwitchesModule.prototype.closeOpenedSections,
                canExecute: () => { return Context.Location() == Enums.Location.ContentEditor; }
            };
            this.commands.push(cmd1);
            this.commands.push(cmd2);
        }

        getCommands(): ICommand[] {
            return this.commands;
        }
    }
}
