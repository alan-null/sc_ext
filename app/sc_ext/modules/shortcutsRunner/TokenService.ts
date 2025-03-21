/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ShortcutsRunner {
    import HttpRequest = Http.HttpRequest;
    import Method = Http.Method;

    export class TokenService {
        private token: Token | undefined;
        private cacheKey: string = 'sc_ext::request_token';
        private baseUrl: string = window.top.location.origin + "/sitecore/shell/default.aspx";
        private initializationKey: string = 'sc_ext::initialization_in_progress';

        constructor(baseUrl?: string) {
            if (baseUrl) {
                this.baseUrl = baseUrl;
            }
            const relativePath = this.baseUrl.replace(window.location.origin, '');

            this.cacheKey = this.cacheKey + relativePath;
            this.initializationKey = this.initializationKey + relativePath;

            this.token = this.getTokenFromCache(this.cacheKey);

            if (!this.token && !this.isInitializationInProgress()) {
                this.initializeToken().catch((error) => { console.error('[TokenService] Failed to initialize token:', error); });
            }
        }

        public async getToken(): Promise<Token> {
            if (this.token) {
                return this.token;
            }

            if (this.isInitializationInProgress()) {
                return this.waitForInitialization();
            }

            return this.initializeToken();
        }

        public async invalidateToken(): Promise<Token> {
            localStorage.clear();
            this.token = undefined;
            this.setInitializationStatus(false);
            return this.getToken();
        }

        private async initializeToken(): Promise<Token> {
            this.setInitializationStatus(true);

            try {
                const token = await this.requestToken();
                this.token = token;
                this.storeTokenInCache(this.cacheKey, token);
                return token;
            } finally {
                this.setInitializationStatus(false);
            }
        }

        private waitForInitialization(): Promise<Token> {
            return new Promise<Token>((resolve) => {
                const interval = setInterval(() => {
                    if (!this.isInitializationInProgress() && this.token) {
                        clearInterval(interval);
                        resolve(this.token);
                    }
                }, 50);
            });
        }

        private requestToken(): Promise<Token> {
            return new Promise<Token>((resolve, reject) => {
                new HttpRequest(this.baseUrl, Method.GET, (e) => {
                    try {
                        const responseText = e.currentTarget.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(responseText, "text/html");

                        const csrfElement = doc.querySelector('#__CSRFTOKEN') as HTMLInputElement | null;
                        const viewstateElement = doc.querySelector('#__VIEWSTATE') as HTMLInputElement | null;

                        if (csrfElement && viewstateElement) {
                            const csrfToken = csrfElement.value;
                            const viewState = viewstateElement.value;
                            resolve(new Token(csrfToken, viewState));
                        } else {
                            reject(new Error('CSRF token or VIEWSTATE not found in the response'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                }).execute();
            });
        }

        private getTokenFromCache(key: string): Token | undefined {
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : undefined;
        }

        private storeTokenInCache(key: string, value: Token): void {
            localStorage.setItem(key, JSON.stringify(value));
        }

        private isInitializationInProgress(): boolean {
            return localStorage.getItem(this.initializationKey) === 'true';
        }

        private setInitializationStatus(value: boolean): void {
            if (value === false) {
                localStorage.removeItem(this.initializationKey);
            } else {
                localStorage.setItem(this.initializationKey, value.toString());
            }
        }
    }
}