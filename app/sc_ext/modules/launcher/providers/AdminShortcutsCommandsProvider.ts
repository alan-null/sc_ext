/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    class ShortcutCommand extends NavigationCommand implements ICommand {
        constructor(name: string, description: string, aspx: string) {
            super(name, description, window.top.location.origin + '/sitecore/admin/' + aspx + '.aspx');
        }
    }
    export class AdminShortcutsCommandsProvider implements ICommandsProvider {
        commands: ICommand[];
        private contextService: ContextService;

        constructor() {
            this.commands = Array<ICommand>();
            this.contextService = new ContextService();
            this.createCommands();
        }

        createCommands(): void {
            this.addCommand('Administration Tools.aspx', 'List of all administrative tools', 'default');
            this.addCommand('Cache.aspx', 'Caches overview.', 'cache');
            if (Context.Location() == Enums.Location.ContentEditor) {
                let command = new DynamicCommand("DB Browser.aspx?id=CurrentItem", "The interface for various item manipulations.", "");
                command.executeCallback = (cmd: DynamicCommand, evt: UserActionEvent) => {
                    this.openDbBrowser("/sitecore/admin/dbbrowser.aspx?db=" + cmd.Database + "&lang=" + cmd.Lang + "&id=" + cmd.ItemId, evt);
                };
                command.canExecuteCallback = () => { return Context.Location() == Enums.Location.ContentEditor; };
                command.descriptionGetter = (cmd: DynamicCommand) => { return "Browse '" + cmd.ItemId + "' item"; };
                this.commands.push(command);
            }
            let dbBrowserCommand = new DynamicCommand('DB Browser.aspx', 'The interface for various item manipulations.', '');
            dbBrowserCommand.executeCallback = (cmd: DynamicCommand, evt: UserActionEvent) => {
                this.openDbBrowser('/sitecore/admin/dbbrowser.aspx', evt);
            };
            dbBrowserCommand.canExecuteCallback = () => { return true; };
            this.commands.push(dbBrowserCommand);
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
            this.commands.push(new NavigationCommand('Sitecore Support Package Generator.aspx', 'Sending such package to Sitecore Support reduces the time it takes to diagnose and resolve Sitecore issues.', window.top.location.origin + '/sitecore/admin/supportpackage'));
            this.addCommand('Sql Shell.aspx', 'Execute sql sripts using the specific connection strings.', 'SqlShell');
            this.addCommand('Unlock Admin.aspx', 'Unlock Admin user.', 'unlock_admin');
            this.addCommand('Update Installation Wizard.aspx', 'Install Sitecore updates.', 'UpdateInstallationWizard');
            this.addCommand('User Info.aspx', 'Logged in user details.', 'UserInfo');
            this.addCommand('Config Layers.aspx', 'Merge configuration files depending on configuration layers and roles', 'ShowConfigLayers');
        }

        addCommand(name: string, description: string, aspx: string): void {
            this.commands.push(new ShortcutCommand(name, description, aspx));
        }

        getCommands(): ICommand[] {
            return this.commands;
        }

        private openDbBrowser(url: string, evt: UserActionEvent): void {
            if (this.contextService.GetDbBrowserSupport() === false) {
                this.notifyDbBrowserUnavailable();
                return;
            }
            new Http.HttpRequest(window.top.location.origin + url, Http.Method.GET, (e: ProgressEvent) => {
                let request = e.currentTarget as XMLHttpRequest;
                let response = request.responseText || "";
                if (!this.contextService.AcceptDbBrowserResponse(request.status, response)) {
                    this.notifyDbBrowserUnavailable();
                    return;
                }
                new NavigationCommand("", "", url).execute(evt);
            }, () => { this.notifyDbBrowserUnavailable(); }).execute();
        }

        private notifyDbBrowserUnavailable(): void {
            SitecoreExtensions.Notification.Instance.warning({
                message: "<b>DB Browser:</b></br>This feature is unavailable because this Sitecore version no longer supports DB Browser.aspx.",
                position: 'topRight', backgroundColor: 'rgba(255,218,157,0.97)', progressBar: false
            });
        }
    }
}