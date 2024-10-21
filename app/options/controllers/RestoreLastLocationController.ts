/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class RestoreLastLocationController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Restore Last Location');
            $scope.vm.title = 'Restore Last Location module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Restore-Last-Location';
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
