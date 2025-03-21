/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.DatabaseSelector {
    import HttpRequest = Http.HttpRequest;
    import Method = Http.Method;
    import TokenService = SitecoreExtensions.Modules.ShortcutsRunner.TokenService;
    import Token = SitecoreExtensions.Modules.ShortcutsRunner.Token;


    export class DatabaseSelectorModule extends ModuleBase implements ISitecoreExtensionsModule {
        private retryCount: number = 3;
        private tokenService: TokenService;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
            this.tokenService = new TokenService();
        }

        canExecute(): boolean {
            return this.options.enabled;
        }

        initialize(): void {
            if (DatabaseNamesStore.getDatabases().length == 0) {
                this.init();
            }
        }

        private getSelectDatabaseDialogResponse(callback) {
            let url = window.top.location.origin + "/sitecore/shell/default.aspx";
            this.tokenService.getToken().then((token) => {
                if (token) {
                    var postData = "&__PARAMETERS=" + "ShowDatabases"
                        + "&__ISEVENT=" + "1"
                        + "&__CSRFTOKEN=" + token.__CSRFTOKEN
                        + "&__VIEWSTATE=" + token.__VIEWSTATE;
                }
                new Http.HttpRequest(url, Http.Method.POST, callback).execute(postData);
            });
        }

        private handleErrorAndRetry(): void {
            if (this.retryCount-- < 0) {
                return;
            }
            this.tokenService.invalidateToken().then(() => {
                this.init();
            });
        }

        private init() {
            this.getSelectDatabaseDialogResponse((e) => {
                if (e.currentTarget.status == 500) {
                    this.handleErrorAndRetry();
                } else {
                    var data = e.currentTarget.responseText;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, "text/html");

                    let trs = doc.querySelectorAll('body>table>tbody>tr');
                    let dbNames = new Array<string>();

                    for (var index = trs.length - 1; index >= 0; index--) {
                        var dbRow = trs[index] as HTMLTableRowElement;
                        if (dbRow.innerText.length > 0) {
                            dbNames.push(dbRow.innerText);
                        } else {
                            break;
                        }
                    }
                    if (dbNames.length > 0) {
                        DatabaseNamesStore.saveDatabases(dbNames);
                    }
                }
            });
        }
    }
}