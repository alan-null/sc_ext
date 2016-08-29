namespace SitecoreExtensions.Types {
    export interface IDictionary {
        add(key: string, value: any): void;
        remove(key: string): void;
        containsKey(key: string): boolean;
        getKeys(): string[];
        getValues(): any[];
    }
}