/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class LauncherController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Launcher')
            $scope.vm.title = 'Launcher module';
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