/// <reference path='_all.ts'/>
'use strict';

import Options = SitecoreExtensions.Options
import Modules = SitecoreExtensions.Modules

function disabled(scExtOptions: Options.IModuleOptions) {
    return scExtOptions != null && scExtOptions.model.enabled == false;
}

if (SitecoreExtensions.Context.IsValid()) {
    var scExtManager;
    var optionsRepository = new Options.OptionsRepository((wrapper: Options.OptionsWrapper) => {
        if (disabled(wrapper.getModuleOptions('General'))) return;

        scExtManager = new SitecoreExtensions.ExtensionsManager();
        scExtManager.modulesOptions = wrapper.options;

        var sectionSwitchesModule = new Modules.SectionSwitches.SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click');
        var dbNameModule = new Modules.DatabaseName.DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header', wrapper.getModuleOptions('Database Name'));
        var launcher = new Modules.Launcher.LauncherModule('Launcher', 'Feel like power user using Sitecore Extensions command launcher.', wrapper.getModuleOptions('Launcher'));
        var databaseColour = new Modules.DatabaseColor.DatabaseColorModule("Database Colour", 'Change the global header colour depeding on current database.', wrapper.getModuleOptions('Database Colour'));
        var lastLocation = new Modules.LastLocation.RestoreLastLocation("Restore Last Location", "Restores last opened item in Content Editor");
        var fieldSearchModule = new Modules.FieldSearch.FieldSearchModule('Field Search', 'Allows to search available fields.');

        scExtManager.addModule(sectionSwitchesModule);
        scExtManager.addModule(dbNameModule);
        scExtManager.addModule(launcher);
        scExtManager.addModule(databaseColour);
        scExtManager.addModule(lastLocation);
        scExtManager.addModule(fieldSearchModule);

        scExtManager.initModules();


        launcher.registerProviderCommands(new Modules.SectionSwitches.SectionSwitchesCommandsProvider());
        launcher.registerProviderCommands(new Modules.LastLocation.RestoreLastLocationCommandProvider());

        window.postMessage({
            sc_ext_enabled: true,
            sc_ext_modules_count: scExtManager.modules.filter(m => { return m.canExecute() }).length.toString()
        }, '*');
    }).loadOptions();
}
