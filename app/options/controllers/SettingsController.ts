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
            alert("Your all Sitecore Extensions options are now set to default.");
            chrome.storage.sync.clear();
        }
    }
}
