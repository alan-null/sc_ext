/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class DatabaseColorController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Database Color')
            $scope.vm.title = 'Database Color module';
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
