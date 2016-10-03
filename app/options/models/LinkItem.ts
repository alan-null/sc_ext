/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    export class LinkItem {
        constructor(
            public name: string,
            public url: string,
            public mode: string
        ) { }
    }
}
