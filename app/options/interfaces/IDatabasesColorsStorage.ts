/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    export interface IDatabasesColorsStorage {
        get(coldStorageCb?: any): DatabaseColorMapping[];
        put(links: DatabaseColorMapping[]);
    }
}