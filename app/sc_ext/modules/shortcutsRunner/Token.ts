namespace SitecoreExtensions.Modules.ShortcutsRunner {
    export class Token {
        __CSRFTOKEN: string;
        __VIEWSTATE: string;
        constructor(csrftoken, viewstate) {
            this.__CSRFTOKEN = csrftoken;
            this.__VIEWSTATE = viewstate;
        }
    }
}