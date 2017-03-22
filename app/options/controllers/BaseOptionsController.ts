/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export abstract class BaseOptionsController extends BaseController {
        name: string;
        model: any;
        optionsProvider: OptionsProvider;
        constructor(public $scope: any, formlyVersion: string, name: string) {
            super();
            this.name = name;
            this.optionsProvider = new OptionsProvider();
            $scope.vm = this;
            $scope.vm.fields = this.getFields();

            $scope.vm.env = {
                angularVersion: angular.version.full,
                formlyVersion: formlyVersion
            };

            this.optionsProvider.getModuleOptions(name, (settings: IModuleOptions) => {
                $scope.$apply(function () {
                    if (settings != null) {
                        $scope.vm.model = settings.model;
                    }
                });
            });

            $scope.vm.onSubmit = this.saveSettings;
        }

        abstract getFields(): any[];

        buildModuleOptions(): ModuleOptionsBase {
            return new ModuleOptionsBase(this.name, this.model);
        }

        saveSettings() {
            var moduleOptions = this.buildModuleOptions();
            this.optionsProvider.setModuleOptions(moduleOptions);
        }
    }
}
