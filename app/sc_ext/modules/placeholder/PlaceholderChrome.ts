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
            const el = this.chrome._originalDOMElement;
            let key: string | undefined = '';
            if (!el) {
                return key;
            }
            if (el.length === 1 && el[0].attributes && el[0].attributes.key && el[0].attributes.key.value) {
                key = el[0].attributes.key.value;
            }
            else if (el.context && el.context.attributes && el.context.attributes.key && el.context.attributes.key.value) {
                key = el.context.attributes.key.value;
            }
            return typeof key === 'string' ? key : '';
        }
    }
}