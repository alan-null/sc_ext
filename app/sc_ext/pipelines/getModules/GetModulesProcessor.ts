/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Pipelines.GetModules {
    export abstract class GetModulesProcessor extends ProcessorBase {
        abstract run(args: GetModulesArgs);
    }
}

