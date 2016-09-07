/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    class ShortcutCommand extends NavigationCommand implements ICommand {
        constructor(name: string, description: string, aspx: string) {
            super(name, description, window.top.location.origin + '/sitecore/admin/' + aspx + '.aspx');
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
            this.addCommand('Dependency Injection Configuration.aspx', 'Shows the configured services. For detailed information use details=1 query.', 'ShowServicesConfig');
            this.addCommand('EventQueue Statistics.aspx', 'Overview of the EventQueue processing.', 'EventQueueStats');
            this.addCommand('Fill DB - Sitecore Item Generator.aspx', 'Fill the specific database with dummy items.', 'FillDB');
            this.addCommand('Install a language.aspx', 'Install a new language for your content in Sitecore. ', 'InstallLanguage');
            this.addCommand('Jobs Viewer.aspx', 'Overview of jobs execution.', 'Jobs');
            this.addCommand('Ling Scratch Pad.aspx', 'Execute custom search code.', 'LinqScratchPad');
            this.addCommand('Logs.aspx', 'Choose log file type to open', 'Logs');
            this.addCommand('Media Hash Generator.aspx', 'Lets you generate hash values for dynamic image scaling URLs', 'MediaHash');
            this.addCommand('Package Item.aspx', 'Package specific items with their dependencies.', 'PackageItem');
            this.addCommand('Path Analyzer Utilities.aspx', 'Configure the Path Analyzer', 'PathAnalyzer');
            this.addCommand('Pipeline Profiler.aspx', 'Pipelines execution timings.', 'pipelines');
            this.addCommand('PublishQueue statistics.aspx', 'Overview of the PublishQueue processing.', 'PublishQueueStats');
            this.addCommand('Raw Search.aspx', 'Search for the specific string in database or on the file system.', 'RawSearch');
            this.addCommand('Rebuild Key Behavior Cache.aspx', '	Rebuild the Key Behavior Cache', 'RebuildKeyBehaviorCache');
            this.addCommand('Rebuild Reporting Database.aspx', 'Rebuild the Reporting database', 'RebuildReportingDB');
            this.addCommand('Redeploy Marketing Data.aspx', 'Redeploy segments and maps for the Path Analyzer and Experience Analytics', 'RedeployMarketingData');
            this.addCommand('Remove Broken Links.aspx', 'Remove broken links from the specific database.', 'RemoveBrokenLinks');
            this.addCommand('Rendering statistics.aspx', 'Overview of renderings performance', 'stats');
            this.addCommand('Restore Item.aspx', 'Restore items from archive.', 'restore');
            this.addCommand('Security Tools.aspx', 'Various login and user management features.', 'SecurityTools');
            this.addCommand('Serialization.aspx', 'Serialize and revert databases', 'serialization');
            this.addCommand('Set Application Center Endpoint.aspx', 'Change Application Center endpoint address', 'SetSACEndpoint');
            this.addCommand('Show Config.aspx', 'Merge configuration files.', 'ShowConfig');
            this.addCommand('Sitecore Support Package Generator.aspx', 'Sending such package to Sitecore Support reduces the time it takes to diagnose and resolve Sitecore issues.', 'supportpackage');
            this.addCommand('Sql Shell.aspx', 'Execute sql sripts using the specific connection strings.', 'SqlShell');
            this.addCommand('Unlock Admin.aspx', 'Unlock Admin user.', 'unlock_admin');
            this.addCommand('Update Installation Wizard.aspx', 'Install Sitecore updates.', 'UpdateInstallationWizard');
            this.addCommand('User Info.aspx', 'Logged in user details.', 'UserInfo');
        }


        addCommand(name: string, description: string, aspx: string): void {
            this.commands.push(new ShortcutCommand(name, description, aspx));
        }

        getCommands(): ICommand[] {
            return this.commands;
        }
    }
}