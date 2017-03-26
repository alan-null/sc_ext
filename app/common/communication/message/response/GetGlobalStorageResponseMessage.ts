/// <reference path='../MessageBase.ts' />


namespace SitecoreExtensions.Common.Communication {
    export class GetGlobalStorageResponseMessage extends MessageBase {
        value: any = null;
        constructor() {
            super();
        }
    }
}