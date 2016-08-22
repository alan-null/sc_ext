/// <reference path='_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    var app = angular.module('sc_ext', ['formly', 'formlyBootstrap'])
        .controller('OptionsController', OptionsController)
        .controller('GeneralOptionsController', GeneralOptionsController)
        .controller('AboutController', AboutController)
        .controller('LauncherController', LauncherController)
        .controller('DatabaseColorController', DatabaseColorController)
        .controller('DatabaseNameController', DatabaseNameController)
        .controller('SectionSwitchesController', SectionSwitchesController)
        .controller('FieldSearchController', FieldSearchController)
        .controller('RestoreLastLocationController', RestoreLastLocationController)
        .controller('TreelistFieldController', TreelistFieldController)
        .controller('SettingsController', SettingsController)
        .controller('TreeScopeController', TreeScopeController)
        .directive('navigation', NavigationDirective);
}
