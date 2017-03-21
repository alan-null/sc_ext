/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Events {
    declare type EventCallback = (arg: EventArgs) => void;

    export class EventHandler {
        constructor(private eventName: string, callback: EventCallback) {
            window.addEventListener('message', (event) => {
                let args = event.data as EventArgs;
                if (args && args.eventName && args.eventName == this.eventName) {
                    callback(args);
                }
            });
        }
    }
}