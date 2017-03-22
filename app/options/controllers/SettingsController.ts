/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class SettingsController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Settings');
            $scope.vm.title = 'Settings';
            $scope.vm.reset = this.reset;
        }

        getFields() {
            return [
                {
                    key: 'resetLinks',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Reset links'
                    },
                },
                {
                    key: 'resetDbColorsMapping',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Reset database colors mapping'
                    },
                }
            ];
        }

        reset() {
            let confirmation = confirm("Are you sure you want to reset all Sitecore Extensions options?");
            if (confirmation) {
                chrome.storage.local.clear();
            }
            if (this.model.resetLinks) {
                localStorage.removeItem('Links');
            }
            if (this.model.resetDbColorsMapping) {
                localStorage.removeItem('Database Colour');
            }
        }
    }
}
