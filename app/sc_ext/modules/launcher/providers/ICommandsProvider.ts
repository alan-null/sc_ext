/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export interface ICommandsProvider {
        getCommands(): ICommand[]
    }
}