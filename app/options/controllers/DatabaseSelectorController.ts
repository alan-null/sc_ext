/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class DatabaseSelectorController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Database Selector');
            $scope.vm.title = 'Database Selector module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Database-Selector';
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