/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export class LaunchpadShortcutCommand extends NavigationCommand implements ICommand {
        constructor(name: string, description: string, url: string) {
            super(name, description, url);
        }
    }

    export class LaunchpadCommandsProvider implements ICommandsProvider {
        private commands: ICommand[];

        constructor() {
            this.commands = Array<ICommand>();
            this.createCommands();
        }
        public getCommands(): ICommand[] {
            return this.commands;
        }

        private createCommands(): void {
            this.addCommand("Experience Analytics", "View a selection of dashboards and reports that enable you to get an overview of the patterns and trends in your experience data", "/sitecore/client/Applications/ExperienceAnalytics/Dashboard/");
            this.addCommand("Experience Profile", "Complete insight into your customers experiences", "/sitecore/client/Applications/ExperienceProfile/Dashboard");
            this.addCommand("Federated Experience Manager", "Track visitor interactions and generate analytics information on external, non-Sitecore websites with Sitecore", "/sitecore/client/Applications/fxm/DomainDashboard");
            this.addCommand("Experience Optimization", "Performance reports", "/sitecore/client/Applications/ContentTesting/ExperienceOptimization/Dashboard");
            this.addCommand("List Manager", "Manage your Sitecore contacts in lists and create the lists of recipients for your email campaigns", "/sitecore/client/applications/List%20Manager/Dashboard");
            this.addCommand("Campaign Creator", "Create new campaign activities and apply taxonomy in order classify campaign activities into larger campaign groups", "/sitecore/client/applications/CampaignManager/Dashboard");
            this.addCommand("Path Analyzer", "Create a map that shows the sequential paths that contacts take as they navigate through your website", "/sitecore/client/applications/PathAnalyzer/PathExplorer");
            this.addCommand("Marketing Control Panel", "Create outcome types and definitions", "/sitecore/shell/Applications/Analytics/Marketing%20Control%20Panel.aspx?sc_bw=1");
            this.addCommand("Content Editor", "Manage and edit all the content on your website", "/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1");
            this.addCommand("Experience Editor", "Make changes to items directly on the page", "/?sc_mode=edit&sc_resolvelanguage=1");
            this.addCommand("Media Library", "The Media Library contains all you media items, such as images, documents, videos, and audio files", "/sitecore/shell/Applications/Media/MediaShop.aspx?sc_bw=1");
            this.addCommand("Workbox", "Displays information about the items in a workflow such as editing history or the number of items that you can find in each workflow state", "/sitecore/shell/Applications/Workbox.aspx?sc_bw=1");
            this.addCommand("Recycle Bin", "Restore deleted items or remove them from Sitecore completely.", "/sitecore/shell/Applications/Archives/Recycle%20Bin.aspx?sc_bw=1");
            this.addCommand("Control Panel", "Manage your Sitecore instance.", "/sitecore/client/Applications/ControlPanel.aspx?sc_bw=1");
            this.addCommand("App Center", "Extend the Sitecore Experience Platform with preintegrated experience management apps", "/sitecore/shell/Applications/Sitecore%20App%20Center.aspx?sc_bw=1");
            this.addCommand("Desktop", "Default start location", "/sitecore/shell/default.aspx");
            this.addCommand("Access Viewer", "Get an overview of the access rights assigned to each account for each item in the content tree", "/sitecore/shell/Applications/Security/Access%20Viewer.aspx?sc_bw=1");
            this.addCommand("Domain Manager", "Use the Domain Manager to create and manage domains", "/sitecore/shell/Applications/Security/Domain%20Manager.aspx?sc_bw=1");
            this.addCommand("Role Manager", "Create and manage the roles that you want to assign the users of your system", "/sitecore/shell/Applications/Security/Role%20Manager.aspx?sc_bw=1");
            this.addCommand("Security Editor", "Manage the access rights that roles and users have to the items in Sitecore", "/sitecore/shell/Applications/Security/Security%20Editor.aspx?sc_bw=1");
            this.addCommand("User Manager", "Create and manage the users that have access to the system", "/sitecore/shell/Applications/Security/User%20Manager.aspx?sc_bw=1");
            this.addCommand("Xpath Builder", "Test Sitecore query", "/sitecore/shell/default.aspx?xmlcontrol=IDE.XPath.Builder");
        }

        private addCommand(name: string, description: string, url: string): void {
            this.commands.push(new LaunchpadShortcutCommand(name, description, url));
        }
    }
}