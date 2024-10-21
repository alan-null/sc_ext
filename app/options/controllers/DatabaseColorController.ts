/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class DatabaseColorController extends BaseOptionsController {
        public static $inject = ['$scope', 'databaseColorsStorage'];
        public defaultColor: string = '2B2B2B';
        private dbColors: DatabaseColorMapping[];

        constructor($scope: any, private dbColorStorage: IDatabasesColorsStorage, formlyVersion: string) {
            super($scope, formlyVersion, 'Database Colour');
            $scope.vm.title = 'Database Color module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Database-Color';

            this.dbColors = $scope.dbColors = dbColorStorage.get((model) => {
                if (model.colors) {
                    this.dbColors = $scope.dbColors = model.colors;
                } else {
                    this.dbColors = $scope.dbColors = [];
                }
                this.colorize();
            });

            $scope.name = '';
            $scope.color = this.defaultColor;
            $scope.editedDbColor = null;
            $scope.order = 0;

            $scope.vm = this;

            $scope.$watch('dbColors', () => this.onDbColorsChange(), true);
        }

        onDbColorsChange() {
            this.dbColorStorage.put(this.dbColors);
            this.colorize();
            if (this.model) {
                this.model.colors = this.dbColors;
            }
        }

        colorize() {
            top.window['jscolor'].installByClassName('jscolor');
            setTimeout(function () {
                let colorPickerElements = document.querySelectorAll("input.jscolor") as any;
                for (var index = 0; index < colorPickerElements.length; index++) {
                    var element = colorPickerElements[index];
                    element._jscLinkedInstance = null;
                    element.jscolor = null;
                }
                top.window['jscolor'].installByClassName('jscolor');
            }, 100);
        }

        add() {
            var name: string = this.$scope.name.trim();
            if (!name.length) {
                return;
            }

            var color: string = this.$scope.color.trim();
            if (!color.length) {
                return;
            }
            this.dbColors.push(new DatabaseColorMapping(name, color, 0));

            this.$scope.name = '';
            this.$scope.color = this.defaultColor;
            this.$scope.order = 0;
        }

        edit(dbColor: DatabaseColorMapping) {
            this.$scope.editedDbColor = dbColor;
            this.$scope.originalDbColor = angular.extend({}, dbColor);
        }

        doneEditing(dbColor: DatabaseColorMapping) {
            this.$scope.editedDbColor = null;
            this.$scope.originalDbColor = null;
            if (this.$scope.reverted) {
                this.$scope.reverted = null;
                return;
            }
            dbColor.name = dbColor.name.trim();
            if (!dbColor.name) {
                this.remove(dbColor);
            }
        }

        remove(dbColor: DatabaseColorMapping) {
            this.dbColors.splice(this.dbColors.indexOf(dbColor), 1);
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
