/// <reference path='../_all.ts'/>
import Pipeline = SitecoreExtensions.Pipelines.Pipeline
import IProcessor = SitecoreExtensions.Pipelines.IProcessor

namespace SitecoreExtensions.Pipelines {
    export class CorePipeline {
        static Run(name: string, args: IPipepineArgs, onExecuted?: any) {
            var pipeline = new Pipeline(Configuration.Get().pipelines[name]);
            if (onExecuted != null) {
                pipeline.onExecuted = onExecuted;
            }
            pipeline.run(args);
        }
    }
}