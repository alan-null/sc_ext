/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    export interface ILinksStorage {
        get(coldStorageCb?: any): LinkItem[];
        put(links: LinkItem[]);
    }
}