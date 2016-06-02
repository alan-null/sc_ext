/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Types {
    export class Dictionary implements IDictionary {
        _keys: string[] = new Array<string>()
        _values: any[] = new Array<string>()

        constructor(init: { key: string; value: any; }[]) {
            for (var x = 0; x < init.length; x++) {
                this[init[x].key] = init[x].value;
                this._keys.push(init[x].key);
                this._values.push(init[x].value);
            }
        }

        add(key: string, value: any) {
            this[key] = value;
            this._keys.push(key);
            this._values.push(value);
        }

        remove(key: string) {
            var index = this._keys.indexOf(key, 0);
            this._keys.splice(index, 1);
            this._values.splice(index, 1);

            delete this[key];
        }

        keys(): string[] {
            return this._keys;
        }

        values(): any[] {
            return this._values;
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
