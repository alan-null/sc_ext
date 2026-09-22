/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Favorites {
    export class FavoritesOptions extends Options.ModuleOptions {
        storageType: Launcher.StorageType = Launcher.StorageType.GlobalStorage;
        shareAcrossInstances: boolean = true;
        maxItems: number = 50;
        showToolbarButton: boolean = true;
        showQuickInfoStar: boolean = true;

        constructor(rawOptions?: Options.ModuleOptionsBase) {
            super();
            if (rawOptions == null || rawOptions.model == null) return;

            this.enabled = rawOptions.model.enabled !== false;
            this.storageType = Launcher.StorageType[rawOptions.model.storageType as string];
            if (this.storageType == null) this.storageType = Launcher.StorageType.GlobalStorage;
            if (rawOptions.model.shareAcrossInstances != null) this.shareAcrossInstances = rawOptions.model.shareAcrossInstances;
            if (rawOptions.model.maxItems != null) this.maxItems = rawOptions.model.maxItems;
            if (rawOptions.model.showToolbarButton != null) this.showToolbarButton = rawOptions.model.showToolbarButton;
            if (rawOptions.model.showQuickInfoStar != null) this.showQuickInfoStar = rawOptions.model.showQuickInfoStar;
        }
    }
}