/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class GoToDatasourceController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Go To Datasource');
            $scope.vm.title = 'Go To Datasource module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Go-To-Datasource';
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