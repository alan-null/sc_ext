/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export class LauncherController extends BaseOptionsController {
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Launcher');
            $scope.vm.title = 'Launcher module';
        }

        buildHeader(template: string, className: string) {
            return { template: template, noFormControl: true, className: className };
        }

        buildInputkey(key: string, defaultValue: number) {
            return {
                key: key,
                className: 'col-lg-3 center-text',
                type: 'input',
                defaultValue: defaultValue,
            };
        }

        getFields() {
            return [
                this.buildHeader('<h3>General</h3>', 'col-lg-12'),
                {
                    key: 'enabled',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Enabled'
                    }
                },
                this.buildHeader('<h3>Results:</h3>', 'col-lg-12'),
                this.buildHeader('Search results count', 'col-lg-6'),
                this.buildInputkey('searchResultsCount', 8),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<h3>Key mapping</h3>', 'col-lg-12'),
                this.buildHeader('<b>Show</b> Launcher', 'col-lg-6'),
                this.buildInputkey('keyBindings.show', 2),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Hide</b> Launcher', 'col-lg-6'),
                this.buildInputkey('keyBindings.hide', 7),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Execute</b> command', 'col-lg-6'),
                this.buildInputkey('keyBindings.executeCommand', 3),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Select</b> next result', 'col-lg-6'),
                this.buildInputkey('keyBindings.selectNextResult', 0),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Select</b> previous result', 'col-lg-6'),
                this.buildInputkey('keyBindings.selectPrevResult', 8),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Select</b> first result', 'col-lg-6'),
                this.buildInputkey('keyBindings.selectFirstResult', 3),
                this.buildHeader('', 'col-lg-3'),
                this.buildHeader('<b>Select</b> last result', 'col-lg-6'),
                this.buildInputkey('keyBindings.selectLastResult', 3),
                this.buildHeader('', 'col-lg-3')
            ];
        }
    }
}