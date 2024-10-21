/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class ToggleRibbonController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Toggle Ribbon');
            $scope.vm.title = 'Toggle Ribbon module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Toggle-Ribbon';
        }

        getFields() {
            return [
                {
                    key: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Enabled'
                    }
                },
            ];
        }
    }
}