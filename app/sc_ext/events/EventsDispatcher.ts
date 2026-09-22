/// <reference path="../_all.ts"/>

namespace SitecoreExtensions.Events {
    export type EventCallback = (arg: EventArgs) => void;

    export class EventsDispatcher {
        private static handlers: { [eventName: string]: EventCallback[] } = {};

        public static AddHandler(eventName: string, callback: EventCallback): void {
            let handlers = EventsDispatcher.handlers[eventName];
            if (!handlers) {
                handlers = EventsDispatcher.handlers[eventName] = [];
            }
            handlers.push(callback);
        }

        public static Dispatch(args: IEventArgs) {
            let handlers = args && EventsDispatcher.handlers[args.eventName];
            if (!handlers) {
                return;
            }
            handlers.forEach(handler => handler(args));
        }
    }
}