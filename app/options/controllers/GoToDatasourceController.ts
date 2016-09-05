/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class GoToDatasourceController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Go To Datasource');
            $scope.vm.title = 'Go To Datasource module';
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