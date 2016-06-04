/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Pipelines {
    export interface IProcessor {
        run(args: IPipepineArgs): void;
        onProcessed();
    }
}

