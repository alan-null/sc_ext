/// <reference path='GlobalStorage.ts'/>
/// <reference path='../sc_ext/modules/favorites/Favorite.ts'/>

namespace SitecoreExtensions.Common {
    import Favorite = Modules.Favorites.Favorite;

    // Shared by the Content Editor and the options page. Always read before a mutation.
    export class FavoritesRepository {
        public static key: string = 'sc_ext::favorites';

        constructor(private useExtensionStorage: boolean) { }

        public async all(): Promise<Favorite[]> {
            var value = this.useExtensionStorage ? await GlobalStorage.get(FavoritesRepository.key)
                : localStorage.getItem(FavoritesRepository.key);
            try {
                var parsed = typeof value == 'string' ? JSON.parse(value) : value;
                var favorites = Array.isArray(parsed) ? parsed.filter(item => item && typeof item.id == 'string' && item.id &&
                    (item.scope == 'any' || (item.scope == 'matching' ? typeof item.hostPattern == 'string' && item.hostPattern :
                        typeof item.host == 'string' && item.host))) : [];
                favorites.forEach(item => { delete item.$$hashKey; });
                return favorites;
            } catch (_) {
                return [];
            }
        }

        public async save(favorites: Favorite[]): Promise<void> {
            favorites.forEach(favorite => { favorite.icon = Favorite.normalizeIcon(favorite); });
            var value = JSON.stringify(favorites, (key, value) => key == '$$hashKey' ? undefined : value);
            if (this.useExtensionStorage) await GlobalStorage.set(FavoritesRepository.key, value);
            else localStorage.setItem(FavoritesRepository.key, value);
        }

        public async update(original: Favorite, updated: Favorite): Promise<void> {
            var error = Favorite.validationError(updated);
            if (error) throw new Error(error);
            updated = Object.assign({}, updated, {
                icon: Favorite.normalizeIcon(Object.assign({}, updated, { host: original.host }))
            });
            var favorites = await this.all();
            var key = Favorite.key(original);
            var index = favorites.findIndex(item => Favorite.key(item) == key);
            if (index < 0) throw new Error('This favorite was removed. Refresh the list and try again.');
            if (favorites.some((item, itemIndex) => itemIndex != index && Favorite.key(item) == Favorite.key(updated))) {
                throw new Error('A favorite for this item, database and scope already exists.');
            }
            favorites[index] = updated;
            await this.save(favorites);
        }

        public async remove(favorite: Favorite): Promise<void> {
            var favorites = await this.all();
            await this.save(favorites.filter(item => Favorite.key(item) != Favorite.key(favorite)));
        }
    }
}
