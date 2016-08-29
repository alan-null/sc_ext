/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.LastLocation {
    export class LastLocationStore {
        private static localStorageKey: string = "sc_ext::last_item";

        public static saveLastItemId(id: string): void {
            localStorage.setItem(this.localStorageKey, id);
        }

        public static loadLastItemId(): string {
            return localStorage.getItem(this.localStorageKey);
        }
    }
}
