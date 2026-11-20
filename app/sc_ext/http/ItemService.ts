namespace SitecoreExtensions.Http {
    export interface ItemServiceQuery {
        database?: string;
        language?: string;
        version?: string;
        fields?: string[];
        includeStandardTemplateFields?: boolean;
        includeMetadata?: boolean;
    }

    // Sitecore Services Client ItemService (/sitecore/api/ssc/item), available since Sitecore 7.5.
    // Requests run as the signed-in Sitecore user, so the Content Editor's own cookie authenticates them.
    export class ItemService {
        private origin: string;

        constructor(origin?: string) {
            this.origin = origin || window.top.location.origin;
        }

        public static normalizeId(id: string): string {
            return (id || "").replace(/[{}]/g, "");
        }

        public itemUrl(id: string, query?: ItemServiceQuery): string {
            let url = this.origin + "/sitecore/api/ssc/item/" + encodeURIComponent(ItemService.normalizeId(id));
            let params = new Array<string>();
            query = query || {};
            let add = (key: string, value: string) => {
                if (value) {
                    params.push(key + "=" + encodeURIComponent(value));
                }
            };
            add("database", query.database);
            add("language", query.language);
            add("version", query.version);
            if (query.fields && query.fields.length > 0) {
                add("fields", query.fields.join(","));
            }
            if (query.includeStandardTemplateFields) {
                add("includeStandardTemplateFields", "true");
            }
            if (query.includeMetadata) {
                add("includeMetadata", "true");
            }
            return params.length > 0 ? url + "?" + params.join("&") : url;
        }

        public getItem(id: string, query?: ItemServiceQuery): Promise<any> {
            let url = this.itemUrl(id, query);
            return new Promise<any>((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.onload = () => {
                    if (request.status !== 200) {
                        reject(new ItemServiceError(request.status));
                        return;
                    }
                    try {
                        resolve(JSON.parse(request.responseText));
                    } catch (error) {
                        reject(new ItemServiceError(request.status));
                    }
                };
                request.onerror = () => { reject(new ItemServiceError(0)); };
                request.open("GET", url, true);
                request.setRequestHeader("Accept", "application/json");
                request.send();
            });
        }
    }

    export class ItemServiceError {
        status: number;
        message: string;

        constructor(status: number) {
            this.status = status;
            this.message = "Item Service request failed with status " + status;
        }

        // 401/403: the ItemService is switched off (ServicesOffPolicy) or blocked for this client.
        public isUnavailable(): boolean {
            return this.status === 0 || this.status === 401 || this.status === 403;
        }
    }
}
