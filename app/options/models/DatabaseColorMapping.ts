/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    export class DatabaseColorMapping {
        constructor(
            public name: string,
            public color: string,
            public order: number
        ) { }
    }
}
