/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class DatabaseNameController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Database Name')
            $scope.vm.title = 'Database Name module';
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
            ]
        }
    }
}