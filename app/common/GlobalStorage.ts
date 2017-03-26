/// <reference path='../../typings/chrome/chrome.d.ts'/>
/// <reference path='../../typings/es6-shim/es6-shim.d.ts'/>

namespace SitecoreExtensions.Common {
    export class GlobalStorage {
        public static async get(key: string): Promise<any> {
            return new Promise<any>(returnValue => {
                chrome.storage.local.get({
                    sc_ext_globalStorage: null,
                }, function (items: any) {
                    if (items.sc_ext_globalStorage) {
                        returnValue(items.sc_ext_globalStorage[key]);
                    }
                    returnValue({});
                });
            });
        }


        public static async set(key: string, value: any): Promise<void> {
            let storage = await this.getStorage();
            storage[key] = value;
            chrome.storage.local.set({
                sc_ext_globalStorage: storage,
            }, () => { });
        }
        private static async getStorage(): Promise<any> {
            return new Promise<any>(returnValue => {
                chrome.storage.local.get({
                    sc_ext_globalStorage: null,
                }, function (items: any) {
                    if (items.sc_ext_globalStorage) {
                        returnValue(items.sc_ext_globalStorage);
                    }
                    returnValue({});
                });
            });
        }
    }
}