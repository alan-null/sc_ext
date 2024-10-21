/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class SectionSwitchesController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Section Switches');
            $scope.vm.title = 'Section Switches module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Section-Switches';
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
