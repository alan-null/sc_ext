/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
	'use strict';
	declare var chrome;
	export class AboutController {
		model: any;
        constructor(private $scope: any) {
            $scope.vm = this;
            $scope.vm.version = chrome.runtime.getManifest().version
        }
	}
}