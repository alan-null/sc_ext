/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class DatabasesColorsStorage implements IDatabasesColorsStorage {
        STORAGE_ID = 'Database Colour';
        optionsProvider: OptionsProvider;

        constructor() {
            this.optionsProvider = new OptionsProvider();
        }

        get(coldStorageCb?: any): DatabaseColorMapping[] {
            this.optionsProvider.getModuleOptions(this.STORAGE_ID, (options: IModuleOptions) => {
                if (options && options.model) {
                    if (coldStorageCb) {
                        coldStorageCb(options.model);
                    }
                }
            });

            if (localStorage.getItem(this.STORAGE_ID) == null) {
                let defaultColorsMapping = this.getDefaultStorageValue();
                localStorage.setItem(this.STORAGE_ID, JSON.stringify(defaultColorsMapping));
                var moduleOptions = new ModuleOptionsBase(this.STORAGE_ID, {
                    enabled: true,
                    colors: defaultColorsMapping
                });
                this.optionsProvider.setModuleOptions(moduleOptions);
                return defaultColorsMapping;
            } else {
                return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
            }

        }

        getDefaultStorageValue(): DatabaseColorMapping[] {
            let links: DatabaseColorMapping[] = []
            links.push(new DatabaseColorMapping("WEB", "DC291E", 0));
            return links;
        }

        put(links: DatabaseColorMapping[]) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(links));
            this.get((model) => {
                model.colors = links;
                var moduleOptions = new ModuleOptionsBase(this.STORAGE_ID, model);
                this.optionsProvider.setModuleOptions(moduleOptions);
            });
        }
    }
}