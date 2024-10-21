/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class TreelistFieldController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Treelist Field');
            $scope.vm.title = 'Treelist Field module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Treelist-Field';
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
