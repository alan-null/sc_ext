/// <reference path='_all.ts'/>

namespace SitecoreExtensions {
    interface IziToastFunction {
        (settings: IziToastSettings): void;
    }

    export class Notification {
        private static instance: Notification;

        public warning(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.warning(s); }, settings);
        }

        public show(settings: IziToastSettings): void | boolean {
            this.invokeLibFun((s) => { iziToast.show(s); }, settings);
        }

        public info(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.info(s); }, settings);
        }

        public error(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.error(s); }, settings);
        }

        public success(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.success(s); }, settings);
        }

        public question(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.question(s); }, settings);
        }

        public settings(settings: IziToastSettings): void {
            this.invokeLibFun((s) => { iziToast.settings(s); }, settings);
        }

        public progress(settings: IziToastSettings, toast: HTMLDivElement, callback?: () => void): IziToastProgress | null { return null; }

        public hide(settings: IziToastSettings, toast: HTMLDivElement | string, closedBy?: string): void { }

        public destroy(): void {
            this.invokeLibFun((s) => { iziToast.destroy(); }, {});
        }

        protected invokeLibFun(fun: IziToastFunction, settings: IziToastSettings): void {
            if (window["iziToast"] != undefined) { fun(settings); } else {
                this.loadLibrary();
                HTMLHelpers.postponeAction(() => {
                    return window["iziToast"] != undefined;
                }, () => { fun(settings); }, 200, 10);
            }
        }

        protected loadLibrary() {
            window.postMessage({
                sc_ext_enabled: true,
                sc_ext_load_lib_request: true,
                sc_ext_lib: "/sc_ext/libraries/iziToast.js"
            }, '*');
        }

        public static get Instance(): Notification {
            return this.instance || (this.instance = new this());
        }
    }
}