/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class GeneralOptionsController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'General')
            $scope.vm.title = 'Sitecore Extensions general options';
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
