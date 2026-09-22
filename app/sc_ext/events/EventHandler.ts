/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Events {
    export class EventHandler {
        constructor(private eventName: string, callback: EventCallback) {
            EventsDispatcher.AddHandler(this.eventName, callback);
        }
    }
}