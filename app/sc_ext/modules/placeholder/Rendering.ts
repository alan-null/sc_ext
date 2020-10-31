/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Placeholder {
    export class Rendering {
        public placeholder: string;
        public uniqueId: string;
        constructor(rendering: any) {
            this.placeholder = rendering["@ph"];
            this.uniqueId = rendering["@uid"];
        }

        public remove(): void {
            let controlId = this.uniqueId.replace(/[-{}]/g, "");
            Sitecore.LayoutDefinition.remove(controlId);
        }
    }
}