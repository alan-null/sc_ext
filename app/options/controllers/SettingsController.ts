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
        includeFavorites: boolean = false;
        private favoritesRepository = new Common.FavoritesRepository(true);
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
                    new ImportButton().disable();
                    $scope.vm.file = null;
                    var reader = new FileReader();
                    reader.onload = function () {
                        try {
                            let obj = JSON.parse(this.result) as OptionsWrapper;
                            if (obj.favorites !== undefined && (!Array.isArray(obj.favorites) || obj.favorites.some(favorite =>
                                !favorite || typeof favorite.id != 'string' || !favorite.id ||
                                typeof favorite.name != 'string' || !favorite.name ||
                                typeof favorite.database != 'string' || !favorite.database ||
                                (favorite.host !== undefined && typeof favorite.host != 'string') ||
                                (favorite.hostPattern !== undefined && typeof favorite.hostPattern != 'string') ||
                                !!Modules.Favorites.Favorite.validationError(favorite)))) {
                                throw new Error('Invalid favorites in backup.');
                            }
                            if (Array.isArray(obj.options)) {
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
                    $scope.vm.file = null;
                    new ImportButton().disable();
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

        private async importFile() {
            let file = this.$scope.vm.file as OptionsWrapper;
            if (file.favorites !== undefined) {
                try {
                    let favorites = await this.favoritesRepository.all();
                    file.favorites.forEach(favorite => {
                        if (!favorites.some(existing => Modules.Favorites.Favorite.key(existing) == Modules.Favorites.Favorite.key(favorite))) {
                            favorites.push(favorite);
                        }
                    });
                    await this.favoritesRepository.save(favorites);
                } catch (_) {
                    alert('Could not import favorites. Please try again.');
                    return;
                }
            }
            this.optionsProvider.setOptions(file.options, () => {
                alert("Your settings have been imported");
                this.importButton.disable();
                this.fileInput.detachFile();
            });
        };

        private exportFile() {
            let includeFavorites = this.includeFavorites;
            this.optionsProvider.getOptions(async (o: OptionsWrapper) => {
                let backup = new OptionsWrapper(o && o.options || []);
                if (includeFavorites) {
                    try {
                        backup.favorites = await this.favoritesRepository.all();
                    } catch (_) {
                        alert('Could not export favorites. Please try again.');
                        return;
                    }
                }
                this.download("settings.json", JSON.stringify(backup));
            });
        }
    }
}
