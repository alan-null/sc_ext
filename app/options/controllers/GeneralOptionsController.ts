/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class GeneralOptionsController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'General');
            $scope.vm.title = 'Sitecore Extensions general options';
        }

        getFields() {
            return [
                { template: '<h3>General</h3>', noFormControl: true },
                {
                    key: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Enabled'
                    },
                },
                { template: '<h3>Extension status icon</h3>', noFormControl: true },
                {
                    key: 'badge.enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Enabled'
                    },
                },
                {
                    key: "badge.statusType",
                    type: "radio",
                    defaultValue: "ModulesCount",
                    templateOptions: {
                        label: "Status type:",
                        options: [
                            {
                                name: "Modules Count",
                                value: "ModulesCount"
                            },
                            {
                                name: "Available Commands Count",
                                value: "AvailableCommandsCount"
                            },
                        ]
                    },
                    hideExpression: '!model.badge.enabled'
                },
                { template: '<h3>Extension status information</h3>', noFormControl: true },
                {
                    key: 'statusInfo.enabled',
                    type: 'checkbox',
                    defaultValue: false,
                    templateOptions: {
                        label: 'Enabled'
                    },
                },
            ];
        }
    }
}
