/// <reference path='../MessageBase.ts' />


namespace SitecoreExtensions.Common.Communication {
    export class SetGlobalStorageRequestMessage extends MessageBase {
        key: string;
        value: any;
        constructor(key: string, value: any) {
            super();
            this.key = key;
            this.value = value;
        }
    }
}