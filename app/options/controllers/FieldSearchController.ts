/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class FieldSearchController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Field Search')
            $scope.vm.title = 'Field Search module';
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
