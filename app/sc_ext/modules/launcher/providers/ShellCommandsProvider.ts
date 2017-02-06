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
            this.addInvokeCommand('Access Viewer', 'Get an overview of the access rights assigned to each account for each item in the content tree', 'shell:accessviewer', canExecute);
            this.addInvokeCommand('Domain Manager', 'Use the Domain Manager to create and manage domains', 'shell:domainmanager', canExecute);
            this.addInvokeCommand('Role Manager', 'Create and manage the roles that you want to assign the users of your system', 'shell:rolemanager', canExecute);
            this.addInvokeCommand('User Manager', 'Create and manage the users that have access to the system', 'shell:usermanager', canExecute);
            this.addInvokeCommand('Security Editor', 'Manage the access rights that roles and users have to the items in Sitecore', 'shell:securityeditor', canExecute);
            this.addInvokeCommand('User Options', 'Application Options', 'shell:useroptions', canExecute);

            this.addInvokeCommand('Add a new language', 'Choose a predefined language code or enter a language identifier and a country/region code for the new language.', 'system:addlanguage', canExecute);
            this.addInvokeCommand('Delete a Language', 'Select the languages that you want to delete.', 'system:deletelanguage', canExecute);
            this.addInvokeCommand('Database Usage', 'Database usage stastistics', 'system:databaseusage', canExecute);
            this.addInvokeCommand('Install Package', 'Package installation window', 'system:installpackage', canExecute);
            this.addInvokeCommand('Rebuild Link Databases', 'Rebuild Link Databases', 'system:rebuildlinkdatabase', canExecute);
            this.addInvokeCommand('About', 'Show license details window', 'system:showabout', canExecute);
            this.addInvokeCommand('Licenses', 'Show installed licenses', 'system:showlicenses', canExecute);

            this.addInvokeCommand('Indexing Manager (rebuild serach index)', 'Select the search indexes that you want to rebuild.', 'indexing:runmanager', canExecute);
            this.addInvokeCommand('Generate the Solr schema', 'Generate the Solr Schema.xml file', 'indexing:generatesolrschema', canExecute);

            this.addInvokeCommand('Deploy marketing definitions', 'Deploy marketing definitions', 'marketing:opendeploydefinitionsdialog', canExecute);
        }
    }
}