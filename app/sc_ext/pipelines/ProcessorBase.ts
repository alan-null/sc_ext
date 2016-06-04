/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Pipelines {
    export abstract class ProcessorBase implements IProcessor {
        abstract run(args: IPipepineArgs)
        onProcessed() { }
    }
}

