/// <reference path='../_all.ts' />
/// <reference path='../../common/FavoritesRepository.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class FavoritesController extends BaseOptionsController {
        favorites: Modules.Favorites.Favorite[] = [];
        editedFavorite: Modules.Favorites.Favorite = null;
        originalFavorite: Modules.Favorites.Favorite = null;
        error: string = '';
        busy: boolean = false;
        search: string = '';
        private repository = new Common.FavoritesRepository(true);

        constructor($scope: any, formlyVersion: string) {
            super($scope, formlyVersion, 'Favorites');
            $scope.vm.title = 'Favorites module';
            $scope.vm.link = 'https://github.com/alan-null/sc_ext/wiki/Favorites';
            this.refreshFavorites();
            var onChanged = (changes, area) => {
                if (area == 'local' && changes.sc_ext_globalStorage) this.refreshFavorites();
            };
            chrome.storage.onChanged.addListener(onChanged);
            $scope.$on('$destroy', () => chrome.storage.onChanged.removeListener(onChanged));
        }

        async refreshFavorites(): Promise<void> {
            try {
                var favorites = await this.repository.all();
                this.$scope.$evalAsync(() => { this.favorites = favorites; });
            } catch (_) {
                this.$scope.$evalAsync(() => { this.error = 'Could not load favorites.'; });
            }
        }

        editFavorite(favorite: Modules.Favorites.Favorite): void {
            this.originalFavorite = favorite;
            this.editedFavorite = Object.assign({}, favorite, {
                scope: favorite.scope == 'any' || favorite.scope == 'matching' ? favorite.scope : 'instance'
            });
            this.error = '';
            requestAnimationFrame(() => {
                var input = document.getElementById('favorite-name');
                if (input) input.focus();
            });
        }

        favoriteKey(favorite: Modules.Favorites.Favorite): string {
            return Modules.Favorites.Favorite.key(favorite);
        }

        cancelEditing(): void {
            this.editedFavorite = null;
            this.originalFavorite = null;
            this.error = '';
        }

        async saveFavorite(): Promise<void> {
            if (this.busy || !this.editedFavorite) return;
            var updated = Object.assign({}, this.editedFavorite);
            updated.name = updated.name.trim();
            updated.host = (updated.host || '').trim().toLowerCase();
            updated.hostPattern = (updated.hostPattern || '').trim().toLowerCase();
            if (!updated.name) return;
            this.busy = true;
            try {
                await this.repository.update(this.originalFavorite, updated);
                await this.refreshFavorites();
                this.$scope.$evalAsync(() => { this.cancelEditing(); });
            } catch (error) {
                this.$scope.$evalAsync(() => { this.error = error.message; });
            } finally {
                this.$scope.$evalAsync(() => { this.busy = false; });
            }
        }

        async deleteFavorite(favorite: Modules.Favorites.Favorite): Promise<void> {
            if (this.busy) return;
            this.busy = true;
            try {
                await this.repository.remove(favorite);
                await this.refreshFavorites();
            } catch (_) {
                this.$scope.$evalAsync(() => { this.error = 'Could not delete this favorite.'; });
            } finally {
                this.$scope.$evalAsync(() => { this.busy = false; });
            }
        }

        buildModuleOptions(): ModuleOptionsBase {
            this.model.maxItems = +this.model.maxItems;
            return super.buildModuleOptions();
        }

        getFields() {
            return [
                {
                    key: 'enabled', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Enabled' }
                },
                {
                    key: 'storageType', type: 'radio', defaultValue: 'GlobalStorage',
                    templateOptions: {
                        label: 'Storage type:',
                        options: [
                            { name: 'Local Storage', value: 'LocalStorage' },
                            { name: 'Global Storage', value: 'GlobalStorage' }
                        ]
                    }
                },
                {
                    key: 'defaultScope', type: 'radio', defaultValue: 'instance',
                    templateOptions: {
                        label: 'Use new favorites on:',
                        options: [
                            { name: 'This instance', value: 'instance' },
                            { name: 'Any instance', value: 'any' }
                        ]
                    }
                },
                {
                    key: 'shareAcrossInstances', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show favorites from other Sitecore instances' }
                },
                {
                    key: 'maxItems', type: 'input', defaultValue: 50,
                    templateOptions: { label: 'Warn after this many favorites', type: 'number', min: 1 }
                },
                {
                    key: 'showToolbarButton', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show Content Editor ribbon tab' }
                },
                {
                    key: 'showQuickInfoStar', type: 'checkbox', defaultValue: true,
                    templateOptions: { label: 'Show item header star' }
                }
            ];
        }
    }
}
