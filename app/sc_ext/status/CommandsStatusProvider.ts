/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Status {
    declare var scExtManager: SitecoreExtensions.ExtensionsManager;
    import ISitecoreExtensionsModule = Modules.ISitecoreExtensionsModule
    import LauncherModule = Modules.Launcher.LauncherModule;

    export class CommandsStatusProvider implements IStatusProvider {
        public getStatus(): string {
            return this.getAvailableCommandsCount().toString();
        }

        private getAvailableCommandsCount(): number {
            let allCommands = this.getAllCommands();
            let availableCommands = allCommands.filter((m) => { return m.canExecute(); })
            return availableCommands.length;
        }

        private getAllCommands(): Modules.Launcher.ICommand[] {
            return this.getLauncherModule().commands;
        }

        private getLauncherModule(): LauncherModule {
            return scExtManager.getModule(LauncherModule) as LauncherModule
        }
    }
}