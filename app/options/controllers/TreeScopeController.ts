/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class TreeScopeController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Tree Scope');
            $scope.vm.title = 'Tree Scope module';
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