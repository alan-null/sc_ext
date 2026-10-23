/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Favorites {
    import StorageType = Launcher.StorageType;
    import FavoritesRepository = Common.FavoritesRepository;

    export class FavoritesStore {
        public onChanged: () => void;
        private cache: Favorite[] = null;
        private repository: FavoritesRepository;

        constructor(private storageType: StorageType, private shareAcrossInstances: boolean, private maxItems: number) {
            this.repository = new FavoritesRepository(storageType == StorageType.GlobalStorage);
            if (storageType == StorageType.GlobalStorage) {
                chrome.storage.onChanged.addListener((changes, area) => {
                    if (area == 'local' && changes.sc_ext_globalStorage) this.invalidate();
                });
            } else {
                window.addEventListener('storage', event => {
                    if (event.key == null || event.key == FavoritesRepository.key) this.invalidate();
                });
            }
        }

        public async all(): Promise<Favorite[]> {
            var favorites = await this.load();
            var host = window.top.location.host;
            return favorites.filter(favorite => Favorite.appliesTo(favorite, host) ||
                this.shareAcrossInstances && favorite.scope != 'any' && favorite.scope != 'matching');
        }

        public async add(favorite: Favorite): Promise<void> {
            var favorites = await this.repository.all();
            var previousLength = favorites.length;
            var existing = favorites.filter(item => Favorite.key(item) == Favorite.key(favorite))[0];
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
            this.cache = await this.repository.all();
            var favorite = this.currentCached(id, database, host);
            if (favorite) await this.repository.remove(favorite);
            this.cache = await this.repository.all();
        }

        public async setScope(id: string, database: string, host: string, scope: 'instance' | 'any'): Promise<void> {
            this.cache = await this.repository.all();
            var favorite = this.currentCached(id, database, host);
            if (!favorite) return;
            var updated = Object.assign({}, favorite, { scope: scope, host: host, icon: Favorite.normalizeIcon(favorite) });
            await this.repository.update(favorite, updated);
            this.cache = await this.repository.all();
        }

        public currentCached(id: string, database: string, host: string): Favorite {
            if (this.cache == null || id == null) return null;
            var matches = this.cache.filter(item => this.matches(item, id, database, host));
            return matches.filter(item => item.scope != 'any' && item.scope != 'matching')[0] ||
                matches.filter(item => item.scope == 'matching')[0] || matches[0] || null;
        }

        public async contains(id: string, database: string, host: string): Promise<boolean> {
            var favorites = await this.load();
            return favorites.some(item => this.matches(item, id, database, host));
        }

        public containsCached(id: string, database: string, host: string): boolean {
            return this.currentCached(id, database, host) != null;
        }

        public async clear(): Promise<void> {
            await this.save([]);
        }

        private async load(): Promise<Favorite[]> {
            if (this.cache != null) return this.cache;

            this.cache = await this.repository.all();
            return this.cache;
        }

        private async save(favorites: Favorite[]): Promise<void> {
            await this.repository.save(favorites);
            this.cache = favorites;
        }

        private invalidate(): void {
            this.cache = null;
            if (this.onChanged) this.onChanged();
        }

        private matches(favorite: Favorite, id: string, database: string, host: string): boolean {
            return id != null && favorite.id.toLowerCase() == id.toLowerCase() && favorite.database == database &&
                Favorite.appliesTo(favorite, host);
        }
    }
}
