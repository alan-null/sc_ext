/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    class ShortcutCommand implements ICommand {
        id: number;
        name: string;
        description: string;
        aspx: string;

        constructor(name, description, aspx) {
            this.id = 0;
            this.aspx = aspx;
            this.name = name;
            this.description = description;
        }

        navigate(aspx: string): void {
            var location = window.top.location.origin + '/sitecore/admin/' + aspx + '.aspx'
            window.top.document.location.href = location;
        }

        canExecute(): boolean {
            return true;
        }

        execute(): void {
            this.navigate(this.aspx)
        }
    }
    export class AdminShortcutsCommandsProvider implements ICommandsProvider {
        commands: ICommand[];

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }

        createCommands(): void {
            this.addCommand('Administration Tools.aspx', 'List of all administrative tools', 'default');
            this.addCommand('Cache.aspx', 'Caches overview.', 'cache');
            this.addCommand('DB Browser.aspx', 'The interface for various item manipulations.', 'dbbrowser');
            this.addCommand('Database Cleanup.aspx', 'Perform various cleanup operations on specific databases.', 'DbCleanup');
            this.addCommand('EventQueue Statistics.aspx', 'Overview of the EventQueue processing.', 'EventQueueStats');
            this.addCommand('Fill DB - Sitecore Item Generator.aspx', 'Fill the specific database with dummy items.', 'FillDB');
            this.addCommand('Jobs Viewer.aspx', 'Overview of jobs execution.', 'Jobs');
            this.addCommand('Ling Scratch Pad.aspx', 'Execute custom search code.', 'LinqScratchPad');
            this.addCommand('Package Item.aspx', 'Package specific items with their dependencies.', 'PackageItem');
            this.addCommand('Pipeline Profiler.aspx', 'Pipelines execution timings.', 'pipelines');
            this.addCommand('PublishQueue statistics.aspx', 'Overview of the PublishQueue processing.', 'PublishQueueStats');
            this.addCommand('Raw Search.aspx', 'Search for the specific string in database or on the file system.', 'RawSearch');
            this.addCommand('Remove Broken Links.aspx', 'Remove broken links from the specific database.', 'RemoveBrokenLinks');
            this.addCommand('Restore Item.aspx', 'Restore items from archive.', 'restore');
            this.addCommand('Security Tools.aspx', 'Various login and user management features.', 'SecurityTools');
            this.addCommand('Serialization.aspx', 'Serialize and revert databases', 'serialization');
            this.addCommand('Set Application Center Endpoint.aspx', 'Change Application Center endpoint address', 'SetSACEndpoint');
            this.addCommand('Show Config.aspx', 'Merge configuration files.', 'ShowConfig');
            this.addCommand('Sql Shell.aspx', 'Execute sql sripts using the specific connection strings.', 'SqlShell');
            this.addCommand('Rendering statistics.aspx', 'Overview of renderings performance', 'stats');
            this.addCommand('Unlock Admin.aspx', 'Unlock Admin user.', 'unlock_admin');
            this.addCommand('Update Installation Wizard.aspx', 'Install Sitecore updates.', 'UpdateInstallationWizard');
            this.addCommand('User Info.aspx', 'Logged in user details.', 'UserInfo');
        }


        addCommand(name: string, description: string, aspx: string): void {
            this.commands.push(new ShortcutCommand(name, description, aspx))
        }

        getCommands(): ICommand[] {
            return this.commands;
        }
    }
}