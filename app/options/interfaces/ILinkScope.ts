/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    export interface ILinkScope extends ng.IScope {
        links: LinkItem[];
        name: string;
        url: string;
        mode: string;
        editedLink: LinkItem;
        originalLink: LinkItem;
        reverted: boolean;
        vm: LinksController;
    }
}
