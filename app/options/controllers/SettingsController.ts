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

                let provider = new Options.OptionsProvider();
                let options = [];
                if (this.model.resetLinks) {
                    localStorage.removeItem('Links');
                } else {
                    options.push(new ModuleOptionsBase('Links', new LinkStorage().get()));
                }

                if (this.model.resetDbColorsMapping) {
                    localStorage.removeItem('Database Colour');
                } else {
                    options.push(new ModuleOptionsBase('Database Colour', {
                        enabled: true,
                        colors: new DatabasesColorsStorage().get()
                    }));
                }
                if (options.length > 0) {
                    provider.setOptions(options, () => { });
                }
            }
        }
    }
}
