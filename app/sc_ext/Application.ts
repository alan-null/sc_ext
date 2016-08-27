/// <reference path='_all.ts'/>
'use strict';

import Options = SitecoreExtensions.Options;
import Modules = SitecoreExtensions.Modules;
import Status = SitecoreExtensions.Status;
import StatusType = SitecoreExtensions.Status.StatusType;


if (SitecoreExtensions.Context.IsValid()) {
    var scExtManager;
    var optionsRepository = new Options.OptionsRepository((wrapper: Options.OptionsWrapper) => {
        var scExtOptions = new Options.ExtensionsOptions(wrapper.getModuleOptions('General'));
        if (!scExtOptions.enabled) return;

        scExtManager = new SitecoreExtensions.ExtensionsManager();
        scExtManager.modulesOptions = wrapper.options;

        var sectionSwitchesModule = new Modules.SectionSwitches.SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click', wrapper.getModuleOptions('Section Switches'));
        var dbNameModule = new Modules.DatabaseName.DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header', wrapper.getModuleOptions('Database Name'));
        var launcher = new Modules.Launcher.LauncherModule('Launcher', 'Feel like power user using Sitecore Extensions command launcher.', wrapper.getModuleOptions('Launcher'));
        var databaseColour = new Modules.DatabaseColor.DatabaseColorModule("Database Colour", 'Change the global header colour depeding on current database.', wrapper.getModuleOptions('Database Colour'));
        var lastLocation = new Modules.LastLocation.RestoreLastLocation("Restore Last Location", "Restores last opened item in Content Editor", wrapper.getModuleOptions('Restore Last Location'));
        var fieldSearchModule = new Modules.FieldSearch.FieldSearchModule('Field Search', 'Allows to search available fields.', wrapper.getModuleOptions('Field Search'));
        var treelistField = new Modules.TreelistField.TreelistFieldModule('Treelist Field', 'Adds path inside treelist field', wrapper.getModuleOptions('Treelist Field'));
        var fieldInspector = new Modules.FieldInspector.FieldInspectorModule('Field Inspector', 'Get real field name value or navigate to field item.', wrapper.getModuleOptions('Field Inspector'));
        var toggleRibbon = new Modules.ToggleRibbon.ToggleRibbonModule('Toggle Ribbon', 'Toggle Ribbon in Experience Editor', wrapper.getModuleOptions('Toggle Ribbon'));
        var databaseSwitcher = new Modules.DatabaseSwitcher.DatabaseSwitcherModule('Database Switcher', 'Change your context database', wrapper.getModuleOptions('Database Switcher'));
        var goToDatasource = new Modules.GoToDatasource.GoToDatasourceModule('Go To Datasource', 'Navigate to a datasource item.', wrapper.getModuleOptions('Go To Datasource'));
        

        scExtManager.addModule(sectionSwitchesModule);
        scExtManager.addModule(dbNameModule);
        scExtManager.addModule(launcher);
        scExtManager.addModule(databaseColour);
        scExtManager.addModule(lastLocation);
        scExtManager.addModule(fieldSearchModule);
        scExtManager.addModule(treelistField);
        scExtManager.addModule(fieldInspector);
        scExtManager.addModule(toggleRibbon);
        scExtManager.addModule(databaseSwitcher);
        scExtManager.addModule(goToDatasource);

        scExtManager.initModules();

        launcher.registerProviderCommands(new Modules.SectionSwitches.SectionSwitchesCommandsProvider());
        launcher.registerProviderCommands(new Modules.LastLocation.RestoreLastLocationCommandProvider());
        launcher.registerProviderCommands(new Modules.ShortcutsRunner.Providers.SitecoreApplicationsCommandsProvider());
        launcher.registerProviderCommands(new Modules.DatabaseSwitcher.DatabaseSelectorCommandsProvider);


        if (scExtOptions.badge.enabled) {
            var statusProvider = getStatusProvider(scExtOptions.badge.statusType);
            var status = statusProvider.getStatus();
            window.onfocus = () => { updateExtensionIcon(status); };
            if (window.frameElement == null || SitecoreExtensions.Context.Location() == SitecoreExtensions.Enums.Location.ExperienceEditor) {
                updateExtensionIcon(status);
            }
        } else {
            updateExtensionIcon("");
        }
    }).loadOptions();
}

function getStatusProvider(type: StatusType): Status.IStatusProvider {
    switch (type) {
        case StatusType.AvailableCommandsCount:
            return new Status.CommandsStatusProvider();
    }
    return new Status.ModulesStatusProvider();
}

function updateExtensionIcon(text: string) {
    window.postMessage({
        sc_ext_enabled: true,
        sc_ext_seticon_request: true,
        sc_ext_badgetext: text
    }, '*');
}