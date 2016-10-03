/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class LinkStorage implements ILinksStorage {
        STORAGE_ID = 'Links';
        optionsProvider: OptionsProvider;

        constructor() {
            this.optionsProvider = new OptionsProvider();
        }

        get(coldStorageCb?: any): LinkItem[] {
            this.optionsProvider.getModuleOptions(this.STORAGE_ID, (options: IModuleOptions) => {
                if (options && options.model) {
                    if (coldStorageCb) {
                        coldStorageCb(options.model);
                    }
                }
            });
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }

        put(links: LinkItem[]) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(links));
            var moduleOptions = new ModuleOptionsBase(this.STORAGE_ID, links as any);
            this.optionsProvider.setModuleOptions(moduleOptions);
        }
    }
}