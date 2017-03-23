/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class DatabaseSelectorController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Database Selector');
            $scope.vm.title = 'Database Selector module';
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