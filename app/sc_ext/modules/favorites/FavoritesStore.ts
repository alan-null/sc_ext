/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Favorites {
    import StorageType = Launcher.StorageType;
    import GlobalStorage = Storage.GlobalStorage;

    export class FavoritesStore {
        private static key: string = "sc_ext::favorites";
        private cache: Favorite[] = null;

        constructor(private storageType: StorageType, private shareAcrossInstances: boolean, private maxItems: number) { }

        public async all(): Promise<Favorite[]> {
            var favorites = await this.load();
            if (this.shareAcrossInstances) return favorites.slice();

            var host = window.top.location.host;
            return favorites.filter(favorite => favorite.host == host);
        }

        public async add(favorite: Favorite): Promise<void> {
            var favorites = await this.load();
            var previousLength = favorites.length;
            var existing = favorites.filter(item => this.sameIdentity(item, favorite))[0];
            if (existing) {
                existing.name = favorite.name;
                existing.path = favorite.path;
                existing.icon = favorite.icon;
                existing.language = favorite.language;
            } else {
                favorites.push(favorite);
            }

            await this.save(favorites);
            if (!existing && this.maxItems > 0 && previousLength < this.maxItems && favorites.length >= this.maxItems) {
                Notification.Instance.warning({
                    message: '<b>Favorites:</b></br>You have reached ' + this.maxItems + ' saved items. All favorites were kept.',
                    position: 'topRight', progressBar: false
                });
            }
        }

        public async remove(id: string, database: string, host: string): Promise<void> {
            var favorites = await this.load();
            await this.save(favorites.filter(item => !this.matches(item, id, database, host)));
        }

        public async contains(id: string, database: string, host: string): Promise<boolean> {
            var favorites = await this.load();
            return favorites.some(item => this.matches(item, id, database, host));
        }

        public containsCached(id: string, database: string, host: string): boolean {
            return this.cache != null && this.cache.some(item => this.matches(item, id, database, host));
        }

        public async clear(): Promise<void> {
            await this.save([]);
        }

        private async load(): Promise<Favorite[]> {
            if (this.cache != null) return this.cache;

            var value = this.storageType == StorageType.GlobalStorage
                ? await GlobalStorage.get(FavoritesStore.key)
                : localStorage.getItem(FavoritesStore.key);
            try {
                var parsed = typeof value == 'string' ? JSON.parse(value) : value;
                this.cache = Array.isArray(parsed)
                    ? parsed.filter(item => item && item.id && item.host)
                    : [];
            } catch (_) {
                this.cache = [];
            }
            return this.cache;
        }

        private async save(favorites: Favorite[]): Promise<void> {
            var value = JSON.stringify(favorites);
            if (this.storageType == StorageType.GlobalStorage) {
                await GlobalStorage.set(FavoritesStore.key, value);
            } else {
                localStorage.setItem(FavoritesStore.key, value);
            }
            this.cache = favorites;
        }

        private sameIdentity(left: Favorite, right: Favorite): boolean {
            return this.matches(left, right.id, right.database, right.host);
        }

        private matches(favorite: Favorite, id: string, database: string, host: string): boolean {
            return favorite.id.toLowerCase() == id.toLowerCase() && favorite.database == database && favorite.host == host;
        }
    }
}