/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class TreeAutoExpandController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Tree Auto Expand');
            $scope.vm.title = 'Tree Auto Expand module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Tree-Auto-Expand';
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