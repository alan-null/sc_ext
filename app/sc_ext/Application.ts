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

        scExtManager = new SitecoreExtensions.ExtensionsManager(wrapper);
        scExtManager.initModules();

        window.postMessage({
            sc_ext_enabled: true,
            sc_ext_modules_count: scExtManager.modules.filter(m => { return m.canExecute() }).length.toString()
        }, '*');
    }).loadOptions();
}
