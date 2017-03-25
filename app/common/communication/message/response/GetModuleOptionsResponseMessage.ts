/// <reference path='../MessageBase.ts' />

namespace SitecoreExtensions.Common.Communication {
    export class GetModuleOptionsResponseMessage extends MessageBase {
        moduleOptions: SitecoreExtensions.Options.IModuleOptions = null;
        constructor() {
            super();
        }
    }
}