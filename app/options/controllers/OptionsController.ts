/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
	'use strict';
	export class OptionsController {
		model: any;
		constructor(private $scope: any) {
			$scope.vm = this;
			$scope.vm.content = "views/general.html";
		}
	}
}