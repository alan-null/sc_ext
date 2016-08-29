namespace SitecoreExtensions.Modules.FieldSearch {
    export class FieldSearchStore {
        public static key: string = "sc_ext::fieldSearch";

        public static getInputValue(): string {
            return localStorage.getItem(this.key);
        }

        public static storeInputValue(str: string): void {
            return localStorage.setItem(this.key, str);
        }

        public static clear(): void {
            localStorage.setItem(this.key, "");
        }
    }
}