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
        .directive('navigation', NavigationDirective)
}
