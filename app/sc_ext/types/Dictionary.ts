/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Types {
    export class Dictionary implements IDictionary {
    keys: string[] = new Array<string>();
        values: any[] = new Array<string>();

        constructor(init: { key: string; value: any; }[]) {
            for (var x = 0; x < init.length; x++) {
                this[init[x].key] = init[x].value;
                this.keys.push(init[x].key);
                this.values.push(init[x].value);
            }
        }

        add(key: string, value: any) {
            this[key] = value;
            this.keys.push(key);
            this.values.push(value);
        }

        remove(key: string) {
            var index = this.keys.indexOf(key, 0);
            this.keys.splice(index, 1);
            this.values.splice(index, 1);

            delete this[key];
        }

        getKeys(): string[] {
            return this.keys;
        }

        getValues(): any[] {
            return this.values;
        }

        containsKey(key: string) {
            if (typeof this[key] === "undefined") {
                return false;
            }
            return true;
        }

        toLookup(): IDictionary {
            return this;
        }
    }
}
