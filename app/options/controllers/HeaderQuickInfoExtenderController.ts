/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class HeaderQuickInfoExtenderController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Header QuickInfo Extender');
            $scope.vm.title = 'Header QuickInfo Extender module';
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