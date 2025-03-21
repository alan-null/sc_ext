/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class FieldInspectorController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Field Inspector');
            $scope.vm.title = 'Field Inspector module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Field-Inspector';
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
                {
                    key: 'fieldName.highlightText',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Highlight field name'
                    }
                },
            ];
        }
    }
}