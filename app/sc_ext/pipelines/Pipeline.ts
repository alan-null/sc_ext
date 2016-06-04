/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Pipelines {
    export class Pipeline {
        processors: IProcessor[]
        constructor(processors: IProcessor[]) {
            this.processors = processors;

            var onExecutedProcessor: IProcessor = {
                run: (args: IPipepineArgs) => { this.onExecuted(args) },
                onProcessed: null
            }
            this.processors.push(onExecutedProcessor);
        }

        run(args: IPipepineArgs, async?: boolean) {
            if (async) {
                this.runAsynchronous(this.processors, args);
            } else {
                this.runSynchronous(this.processors, args);
            }
        }

        onExecuted(args: IPipepineArgs) { }

        private runSynchronous(processors: IProcessor[], args: IPipepineArgs) {
            if (processors.length > 0) {
                var otherProcessors = processors.slice(1);
                var processor = processors[0];
                processor.onProcessed = () => {
                    this.runSynchronous(otherProcessors, args);
                };
                processor.run(args);
            }
        }

        private runAsynchronous(processors: IProcessor[], args: IPipepineArgs) {
            for (var i = 0; i < processors.length; i++) {
                var processor = processors[i];
                processor.run(args);
            }
        }
    }
}