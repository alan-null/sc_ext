/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class FavoritesController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Favorites');
            $scope.vm.title = 'Favorites module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Favorites';
        }

        buildModuleOptions(): ModuleOptionsBase {
            this.model.maxItems = +this.model.maxItems;
            return super.buildModuleOptions();
        }

        getFields() {
            return [
                {
                    key: 'enabled', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Enabled' }
                },
                {
                    key: 'storageType', type: 'radio', defaultValue: 'GlobalStorage',
                    templateOptions: {
                        label: 'Storage type:',
                        options: [
                            { name: 'Local Storage', value: 'LocalStorage' },
                            { name: 'Global Storage', value: 'GlobalStorage' }
                        ]
                    }
                },
                {
                    key: 'shareAcrossInstances', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show favorites from other Sitecore instances' }
                },
                {
                    key: 'maxItems', type: 'input', defaultValue: 50,
                    templateOptions: { label: 'Warn after this many favorites', type: 'number', min: 1 }
                },
                {
                    key: 'showToolbarButton', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show Content Editor ribbon tab' }
                },
                {
                    key: 'showQuickInfoStar', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show item header star' }
                }
            ];
        }
    }
}