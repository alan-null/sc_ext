/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ShortcutsRunner {
    import HttpRequest = Http.HttpRequest;
    import Method = Http.Method;

    export class ShortcutRunner {
        private tokenService: TokenService;
        private token: Token;
        private cacheKey: string = 'sc_ext::request_token';
        private baseUrl: string = window.top.location.origin + "/sitecore/shell/default.aspx";

        constructor() {
            this.tokenService = new TokenService();
            this.token = this.tokenService.getToken();
        }

        public runShortcutCommand(shortcutId: string): void {
            this.getShortcutUrl((e) => {
                if (e.currentTarget.status == 500) {
                    this.handleErrorAndRetry(shortcutId);
                } else {
                    var data = JSON.parse(e.currentTarget.responseText);
                    this.invokeCommand(data);
                }
            }, shortcutId)
        }

        private invokeCommand(data): void {
            var lastCommandIndex = data.commands.length - 1;
            var iFrame = data.commands[lastCommandIndex].value;
            var urls = iFrame.match(/\/sitecore\/shell(.)*png/)
            if (urls) {
                var url = urls[0]
                window.top.document.location.href = window.top.location.origin + url;
            }
        }

        private handleErrorAndRetry(shortcutId: string): void {
            this.tokenService.invalidateToken((token) => {
                this.token = token;
                this.runShortcutCommand(shortcutId);
            });
        }

        private getShortcutUrl(callback: Function, shortcutId: string): void {
            var req = new HttpRequest(this.baseUrl, Method.POST, callback);
            var postData = "&__PARAMETERS=" + "RunShortcut%28%26quot%3B%7B" + shortcutId + "%7D%26quot%3B%29"
                + "&__ISEVENT=" + "1"
                + "&__CSRFTOKEN=" + this.token.__CSRFTOKEN
                + "&__VIEWSTATE=" + this.token.__VIEWSTATE
            req.execute(postData);
        }
    }
}