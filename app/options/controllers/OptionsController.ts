/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class OptionsController extends BaseController {
        model: any;
        constructor(private $scope: any) {
            super();
            $scope.vm = this;
            $scope.vm.content = "views/general.html";
        }
    }
}