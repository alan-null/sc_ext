/// <reference path='../MessageBase.ts' />


namespace SitecoreExtensions.Common.Communication {
    export class GetGlobalStorageRequestMessage extends MessageBase {
        key: string;
        constructor(key: string) {
            super();
            this.key = key;
        }
    }
}