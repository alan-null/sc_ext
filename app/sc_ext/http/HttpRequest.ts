/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Http {
    export class HttpRequest {
        private url: string;
        private method: Method;
        private callback: any;
        private errorCallback: any;

        constructor(url: string, method: Method, callback, errorCallback?) {
            this.url = url;
            this.method = method;
            this.callback = callback;
            this.errorCallback = errorCallback;
        }

        public execute(postData?: any) {
            var method = this.getMethodValue(this.method);
            var async = true;
            var request = new XMLHttpRequest();
            request.onload = this.callback;
            if (this.errorCallback) {
                request.onerror = this.errorCallback;
            }
            request.open(method, this.url, async);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            if (postData) {
                request.send(postData);
            } else {
                request.send();
            }
        }

        private getMethodValue(method: Method): string {
            switch (method) {
                case Method.POST:
                    return "POST";
                case Method.GET:
                    return "GET";
            }
            return "GET";
        }
    }
}

