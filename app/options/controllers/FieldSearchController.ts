/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class FieldSearchController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Field Search');
            $scope.vm.title = 'Field Search module';
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
                { template: '<h3>Input box behaviour</h3>', noFormControl: true },
                {
                    key: "inputbox.rememberValue",
                    type: "radio",
                    defaultValue: "remmeber",
                    templateOptions: {
                        label: "When changing item or refreshing a page:",
                        options: [
                            {
                                name: "Remember input box value",
                                value: "remmeber"
                            },
                            {
                                name: "Clear input box value",
                                value: "clear"
                            },
                        ]
                    }
                }
            ];
        }
    }
}
