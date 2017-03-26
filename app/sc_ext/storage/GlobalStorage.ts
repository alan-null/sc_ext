/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Storage {
    export class GlobalStorage {
        public static set(key: string, value: any): void {
            let message = new Communication.SetGlobalStorageRequestMessage(key, value);
            window.postMessage(message, '*');
        }

        public static async get(key: string): Promise<any> {
            return new Promise<any>(returnValue => {
                window.addEventListener('message', function (event) {
                    let validator = new Communication.DataParser();
                    let instance = validator.tryParse<Communication.GetGlobalStorageResponseMessage>(event.data);
                    if (instance instanceof Communication.GetGlobalStorageResponseMessage) {
                        if (instance.value) {
                            returnValue(instance.value);
                        } else {
                            returnValue(null);
                        }
                    }
                });
                let message = new Communication.GetGlobalStorageRequestMessage(key);
                window.postMessage(message, '*');
            });
        }
    }
}