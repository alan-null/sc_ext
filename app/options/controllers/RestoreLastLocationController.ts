/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class RestoreLastLocationController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Restore Last Location');
            $scope.vm.title = 'Restore Last Location module';
            $scope.vm.link = 'https://alan-null.github.io/sc_ext/modules/restore-last-location/';
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
