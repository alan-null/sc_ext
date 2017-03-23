/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class ToggleRibbonController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Toggle Ribbon');
            $scope.vm.title = 'Toggle Ribbon module';
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