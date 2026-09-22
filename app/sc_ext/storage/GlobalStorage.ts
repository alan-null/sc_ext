/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Storage {
    export class GlobalStorage {
        public static set(key: string, value: any): Promise<void> {
            return SitecoreExtensions.Common.GlobalStorage.set(key, value);
        }

        public static async get(key: string): Promise<any> {
            return SitecoreExtensions.Common.GlobalStorage.get(key);
        }
    }
}