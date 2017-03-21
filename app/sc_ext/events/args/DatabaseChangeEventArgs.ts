/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Events {
    export class DatabaseChangeEventArgs extends EventArgs {
        constructor(public databaseName: string) {
            super();
            this.eventName = "onDatabaseChange";
            this.databaseName = databaseName;
        }
    }
}