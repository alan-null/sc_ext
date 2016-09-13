/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class SettingsController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'General');
            $scope.vm.title = 'Settings';
            $scope.vm.reset = this.reset;
        }

        getFields() {
            return [];
        }

        reset() {
            let confirmation = confirm("Are you sure you want to reset all Sitecore Extensions options?");
            if (confirmation) {
                chrome.storage.local.clear();
            }
        }
    }
}
