/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Events {
    export class EventsDispatcher {
        public static Dispatch(args: IEventArgs) {
            window.postMessage(args, '*');
        }
    }
}