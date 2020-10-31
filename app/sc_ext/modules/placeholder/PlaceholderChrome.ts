/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Placeholder {
    export class PlaceholderChrome {
        chrome: any;

        constructor(phChrome: any) {
            this.chrome = phChrome;
        }

        public addCommand(cmd: IPlaceholderCommand) {
            return this.chrome.data.commands.push(cmd);
        }

        public getPlaceholderId(): string {
            return this.chrome._originalDOMElement.context.attributes.key.value;
        }
    }
}