/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
	'use strict';
	declare var chrome;
	export class AboutController extends BaseController  {
		model: any;
        constructor(private $scope: any) {
			super();
            $scope.vm = this;
            $scope.vm.version = chrome.runtime.getManifest().version
        }
	}
}