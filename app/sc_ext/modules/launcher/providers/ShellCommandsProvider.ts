/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export class ShellCommandsProvider extends BaseCommandsProvider {
        constructor() {
            super();
        }

        createCommands(): void {
            var canExecute = () => { return Context.Location() == Enums.Location.ContentEditor || Context.Location() == Enums.Location.Desktop; };

            this.addInvokeCommand('Analytics - Reports', 'Experience Analytics reports', 'analytics:reports', canExecute);
            this.addInvokeCommand('Analytics - Status Information', 'An overview of your servers and their current status.', 'analytics:status', canExecute);
            this.addInvokeCommand('Export Languages', 'Select the languages that you want to export.', 'globalization:exportlanguage', canExecute);
            this.addInvokeCommand('Import Languages', 'Enter the language file name of the language that you want to import', 'globalization:importlanguage', canExecute);
            this.addInvokeCommand('Scan for Untranslated Fields', 'Select the languages that you want to scan for untranslated fields.', 'globalization:untranslatedfields', canExecute);
            this.addInvokeCommand('Change Region and Language Options', 'Select your preferred number and date format and the application language', 'preferences:changeregionalsettings', canExecute);
            this.addInvokeCommand('Change personal/user Information', 'Change your personal information', 'preferences:changeuserinformation', canExecute);
            this.addInvokeCommand('Change wallpaper', 'Select a desktop background.', 'preferences:changewallpaper', canExecute);
            this.addInvokeCommand('Content Carousel', 'Presents content items as a carousel', 'carousel:home', canExecute);
            this.addInvokeCommand('Customize My Toolbar', 'Add or remove commands from My Toolbar.', 'ribbon:customize', canExecute);
            this.addInvokeCommand('User Options', 'Application Options', 'shell:useroptions', canExecute);
            this.addInvokeCommand('Access Viewer', 'Get an overview of the access rights assigned to each account for each item in the content tree', 'shell:accessviewer', canExecute, 'D2D8EF5D-ABA7-485B-ACA6-CEDCD495AB5D');
            this.addInvokeCommand('Domain Manager', 'Use the Domain Manager to create and manage domains', 'shell:domainmanager', canExecute, 'FDDE6301-442C-44B8-B934-0F1FF29413F6');
            this.addInvokeCommand('Role Manager', 'Create and manage the roles that you want to assign the users of your system', 'shell:rolemanager', canExecute, '18156152-715C-4E3F-969A-94BE59A049E9');
            this.addInvokeCommand('User Manager', 'Create and manage the users that have access to the system', 'shell:usermanager', canExecute, 'E89F2A3C-8F3E-491E-AB81-695FBDE3479E');
            this.addInvokeCommand('Security Editor', 'Manage the access rights that roles and users have to the items in Sitecore', 'shell:securityeditor', canExecute, '0EF5CACF-4C67-46F5-8DEA-DA93700B52F7');

            this.addInvokeCommand('Add a new language', 'Choose a predefined language code or enter a language identifier and a country/region code for the new language.', 'system:addlanguage', canExecute);
            this.addInvokeCommand('Delete a Language', 'Select the languages that you want to delete.', 'system:deletelanguage', canExecute);
            this.addInvokeCommand('Database Usage', 'Database usage stastistics', 'system:databaseusage', canExecute);
            this.addInvokeCommand('Rebuild Link Databases', 'Rebuild Link Databases', 'system:rebuildlinkdatabase', canExecute);
            this.addInvokeCommand('License Details', 'Show license details window', 'system:showabout', canExecute, '70EEF2F0-4A17-427B-99A1-5069658EAE7A');
            this.addInvokeCommand('Licenses', 'Show installed licenses', 'system:showlicenses', canExecute, 'B079E515-F945-41CC-A3C8-B94777BF4B95');
            this.addInvokeCommand('Install Package', 'Package installation window', 'system:installpackage', canExecute, 'DCA06E38-AF13-4299-BFA3-4D0DDCA0A9BF');

            this.addInvokeCommand('Indexing Manager (rebuild serach index)', 'Select the search indexes that you want to rebuild.', 'indexing:runmanager', canExecute);
            this.addInvokeCommand('Generate the Solr schema', 'Generate the Solr Schema.xml file', 'indexing:generatesolrschema', canExecute);

            this.addInvokeCommand('Deploy marketing definitions', 'Deploy marketing definitions', 'marketing:opendeploydefinitionsdialog', canExecute);
            this.addInvokeCommand('Search', 'Open the Search application. (Ctrl+Shift+F)', 'shell:search', canExecute, '0490EE27-D17D-46F6-A4DF-C0864EE9DD52');
        }
    }
}