/// <reference path="../../../_all.ts"/>

namespace SitecoreExtensions.Modules.ShortcutsRunner.Providers {
    import ICommand = Launcher.ICommand

    export class SitecoreApplicationsCommandsProvider implements Launcher.Providers.ICommandsProvider {
        private commands: ICommand[];
        private runner: ShortcutRunner;

        constructor() {
            this.commands = Array<ICommand>();
            this.runner = new ShortcutRunner();
            this.createCommands();
        }
        public getCommands(): ICommand[] {
            return this.commands;
        }

        private createCommands() {
            this.addCommand("About", "License Details", "{70EEF2F0-4A17-427B-99A1-5069658EAE7A}");
            this.addCommand("Access Viewer", "Get an overview of the access rights assigned to each account for each item in the content tree", "{D2D8EF5D-ABA7-485B-ACA6-CEDCD495AB5D}");
            this.addCommand("Archive", "See archived items", "{ABF5E348-B8C1-4796-8100-8F012AE4713E}");
            this.addCommand("Content Editor", "Manage your website content.", "{E28353A0-FB68-455B-9B2E-99AD280EF64E}");
            this.addCommand("Developer Center", "Create new functionality.", "{6041C6E9-4054-4116-95C0-7967DB8A0583}");
            this.addCommand("Domain Manager", "Use the Domain Manager to create and manage domains", "{FDDE6301-442C-44B8-B934-0F1FF29413F6}");
            this.addCommand("File Explorer", "Browse your web application files.", "{9EA291E8-3E56-4335-B8B9-296F13638DAC}");
            this.addCommand("Image Editor", "Edit images", "{42D4CBE0-60A9-4A8B-81A6-9596246976C5}");
            this.addCommand("Install Package", "Package design tool", "{DCA06E38-AF13-4299-BFA3-4D0DDCA0A9BF}");
            this.addCommand("Keyboard Map", "You can use this functionality to assign keyboard shortcuts to an action in Sitecore, for example, Save or Open.", "{5F4DA892-CD7F-40A6-B115-31019633639D}");
            this.addCommand("Licenses", "Information about installed licenses.", "{B079E515-F945-41CC-A3C8-B94777BF4B95}");
            this.addCommand("Log Viewer", "View your applications logs", "{27EC41F4-EA84-4FC6-A996-C56FE397EC18}");
            this.addCommand("Marketing Control Panel", "Configure marketing features.", "{B55C7E99-8692-4756-B24C-29DD003888F9}");
            this.addCommand("Media Library", "Maintain your media items.", "{7CF7BC24-FA44-46C3-A82B-5A9A1E9E2A0F}");
            this.addCommand("Package Designer", "Package design tool", "{584C2F78-42A4-4E46-B5DC-211D245169E9}");
            this.addCommand("Recycle Bin", "Restore deleted items or remove them from Sitecore completely.", "{6FED6C55-9558-4E80-AB88-42E519D6DFD8}");
            this.addCommand("Role Manager", "Create and manage the roles that you want to assign the users of your system", "{18156152-715C-4E3F-969A-94BE59A049E9}");
            this.addCommand("Run", "Enter the name of the application, folder, document, or internet resource that you want to open.", "{8CC6D3B6-9081-4E04-84E3-F051A3194CB4}");
            this.addCommand("Scan for Broken Links", "Scan for Broken Links", "{92BFFD39-D745-4B42-A356-1CD24540CD53}");
            this.addCommand("Search", "Sitecore search application", "{0490EE27-D17D-46F6-A4DF-C0864EE9DD52}");
            this.addCommand("Security Editor", "Manage the access rights that roles and users have to the items in Sitecore", "{0EF5CACF-4C67-46F5-8DEA-DA93700B52F7}");
            this.addCommand("Template Manager", "Create new templates.", "{B3702304-16E6-4EA0-ADDA-5390B56A4164}");
            this.addCommand("User manager", "Create and manage the users that have access to the system", "{E89F2A3C-8F3E-491E-AB81-695FBDE3479E}");
            this.addCommand("Workbox", "Displays information about the items in a workflow such as editing history or the number of items that you can find in each workflow state", "{5AB73C5D-6B10-464D-B7B7-12CDB9DA5931}");
        }

        private addCommand(name: string, description: string, id: string): void {
            this.commands.push(new AppShortcutCommand(name, description, this.runner, this.trimId(id)))
        }

        private trimId(id: string): string {
            return id.replace('{', '').replace('}', '');
        }
    }
}