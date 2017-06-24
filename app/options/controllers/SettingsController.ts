/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    class ImportButton {
        private element: HTMLInputElement;
        constructor() {
            this.element = document.getElementById('ImportFile') as HTMLInputElement;
        }

        public enable(): void {
            this.element.classList.remove('disabled');
        }

        public disable(): void {
            this.element.classList.add('disabled');
        }
    }
    class FileInput {
        private element: HTMLInputElement;

        constructor() {
            this.element = document.getElementById('file') as HTMLInputElement;
        }

        public detachFile(): void {
            this.element.value = "";
        }
    }

    export class SettingsController extends BaseOptionsController {
        optionsProvider: OptionsProvider = new OptionsProvider();
        importButton: ImportButton = new ImportButton();
        fileInput: FileInput = new FileInput();
        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Settings');
            $scope.vm.title = 'Settings';
            $scope.vm.reset = this.reset;

            $scope.vm.exportFile = this.exportFile;
            $scope.vm.importFile = this.importFile;

            document.getElementById('file').addEventListener('change', readFile, false);
            function readFile(evt) {
                var files = evt.target.files;
                var file = files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        try {
                            let obj = JSON.parse(this.result) as OptionsWrapper;
                            if (obj.options && obj.options.length > 0) {
                                $scope.vm.file = obj;
                                new ImportButton().enable();
                                return;
                            }
                        } catch (error) {
                            console.log(error);
                        }
                        alert("Could not deserialize uploaded file. Make sure you've selected JSON file with appropiate content inside.");
                    };
                    reader.readAsText(file);
                } else {
                    $scope.vm.file = this.result;
                    new ImportButton().enable();
                }
            }
        }

        getFields() {
            return [
                {
                    key: 'resetLinks',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Reset links'
                    },
                },
                {
                    key: 'resetDbColorsMapping',
                    type: 'checkbox',
                    defaultValue: true,
                    templateOptions: {
                        label: 'Reset database colors mapping'
                    },
                }
            ];
        }

        reset() {
            let confirmation = confirm("Are you sure you want to reset all Sitecore Extensions options?");
            if (confirmation) {
                chrome.storage.local.clear();

                let provider = new Options.OptionsProvider();
                let options = [];
                if (this.model.resetLinks) {
                    localStorage.removeItem('Links');
                } else {
                    options.push(new ModuleOptionsBase('Links', new LinkStorage().get()));
                }

                if (this.model.resetDbColorsMapping) {
                    localStorage.removeItem('Database Colour');
                } else {
                    options.push(new ModuleOptionsBase('Database Colour', {
                        enabled: true,
                        colors: new DatabasesColorsStorage().get()
                    }));
                }
                if (options.length > 0) {
                    provider.setOptions(options, () => { });
                }
            }
        }

        private download(filename, text) {
            var node = document.createElement('a');
            node.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            node.setAttribute('download', filename);
            node.style.display = 'none';
            document.body.appendChild(node);
            node.click();
            document.body.removeChild(node);
        }

        private importFile() {
            let file = this.$scope.vm.file as OptionsWrapper;
            this.optionsProvider.setOptions(file.options, () => {
                alert("Your settings have been imported");
                this.importButton.disable();
                this.fileInput.detachFile();
            });
        };

        private exportFile() {
            this.optionsProvider.getOptions((o: OptionsWrapper) => {
                this.download("settings.json", JSON.stringify(o));
            });
        }
    }
}
