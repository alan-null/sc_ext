/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ShortcutsRunner {
    import HttpRequest = Http.HttpRequest;
    import Method = Http.Method;

    export class TokenService {
        private token: Token;
        private cacheKey: string = 'sc_ext::request_token';
        private baseUrl: string = window.top.location.origin + "/sitecore/shell/default.aspx";

        constructor(baseUrl?: string) {
            if (baseUrl) {
                this.baseUrl = baseUrl;
            }
            this.cacheKey = this.cacheKey + this.baseUrl.replace(window.location.origin, '');
            this.token = this.getTokenFromCache(this.cacheKey);
            if (this.token == undefined) {
                this.getRequestToken((t) => {
                    this.token = t;
                    this.storeTokenInCache(this.cacheKey, t);
                });
            }
        }

        public async getToken(): Promise<Token> {
            return new Promise<Token>(returnValue => {
                if (this.token) {
                    returnValue(this.token);
                } else {
                    this.getRequestToken((t) => {
                        this.token = t;
                        this.storeTokenInCache(this.cacheKey, t);
                        returnValue(t);
                    });
                }
            });
        }

        public async invalidateToken(): Promise<Token> {
            localStorage.clear();
            return new Promise<Token>(returnValue => {
                this.getRequestToken((t) => {
                    this.token = t;
                    returnValue(t);
                    this.storeTokenInCache(this.cacheKey, t);
                });
            });
        }

        private getRequestToken(callback: Function): void {
            new HttpRequest(this.baseUrl, Method.GET, (e) => {
                var data = e.currentTarget.responseText;
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");

                let csrfElement = (doc.querySelector('#__CSRFTOKEN') as HTMLInputElement);
                let viewstateElement = (doc.querySelector('#__VIEWSTATE') as HTMLInputElement);
                if (csrfElement && viewstateElement) {
                    var __CSRFTOKEN = csrfElement.attributes['value'].value;
                    var __VIEWSTATE = viewstateElement.attributes['value'].value;
                    callback(new Token(__CSRFTOKEN, __VIEWSTATE));
                }
            }).execute();
        }

        private getTokenFromCache(key: string): Token {
            var cached = localStorage[key];
            if (cached != undefined) {
                return JSON.parse(cached);
            }
        }

        private storeTokenInCache(key: string, value: any): void {
            localStorage[key] = JSON.stringify(value);
        }
    }
}