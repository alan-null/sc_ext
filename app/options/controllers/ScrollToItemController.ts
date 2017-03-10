/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class ScrollToItemController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Scroll To Item');
            $scope.vm.title = 'Scroll To Item module';
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