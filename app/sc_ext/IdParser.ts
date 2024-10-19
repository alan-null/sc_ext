'use strict';
namespace SitecoreExtensions {
    export class IdParser {
        idPattern: string = "{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}}";

        constructor() { }

        public extractID(params: string) {
            var results = params.match(this.idPattern);
            if (results != null && results.length > 0) {
                return results[0];
            }
        }

        public match(id: string): RegExpMatchArray | null {
            return id.match(this.idPattern);
        }
    }
}

