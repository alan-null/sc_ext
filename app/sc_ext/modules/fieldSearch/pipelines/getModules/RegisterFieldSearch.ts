/// <reference path='../../_all.ts'/>

// import GetModulesProcessor = SitecoreExtensions.Pipelines.GetModules.GetModulesProcessor
// import GetModulesArgs = SitecoreExtensions.Pipelines.GetModules.GetModulesArgs

namespace SitecoreExtensions.Modules.FieldSearch.Pipelines.GetModules {
    export class RegisterFieldSearch extends GetModulesProcessor {
        run(args: GetModulesArgs) {
            var fieldSearchModule = new Modules.FieldSearch.FieldSearchModule('Field Search', 'Allows to search available fields.');
            args.addModule(fieldSearchModule);

            this.onProcessed();
        }
    }
}

