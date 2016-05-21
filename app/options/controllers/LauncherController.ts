/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class LauncherController {
        model: any;
        constructor(private $scope: any) {
            $scope.vm = this;

            $scope.vm.onSubmit = this.saveSettings;

            $scope.vm.title = 'Launcher module';
            $scope.vm.env = {
                angularVersion: angular.version.full,
                formlyVersion: "8.2.1"
            };

            $scope.vm.model = {
                enabled: true
            };

            $scope.vm.fields = [{
                key: 'enabled',
                type: 'checkbox',
                templateOptions: {
                    label: 'Enabled'
                }
            }];
        }

        saveSettings() {
            console.log(this.model);
        }
    }
}
