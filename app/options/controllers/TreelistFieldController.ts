/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class TreelistFieldController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Treelist Field');
            $scope.vm.title = 'Treelist Field module';
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
