/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class OptionsController extends BaseController {
        model: any;
        constructor(private $scope: any) {
            super();
            $scope.vm = this;
            $scope.vm.content = /(?:^\?|&)module=favorites(?:&|$)/.test(window.location.search)
                ? 'views/modules/favorites/index.html' : 'views/general.html';
        }
    }
}
