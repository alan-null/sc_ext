/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class HeaderQuickInfoExtenderController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Header QuickInfo Extender');
            $scope.vm.title = 'Header QuickInfo Extender module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Header-QuickInfo-Extender';
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