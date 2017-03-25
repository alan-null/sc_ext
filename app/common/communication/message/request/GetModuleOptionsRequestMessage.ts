/// <reference path='../MessageBase.ts' />

namespace SitecoreExtensions.Common.Communication {
    export class GetModuleOptionsRequestMessage extends MessageBase {
        moduleName: string;
        constructor(moduleName: string) {
            super();
            this.moduleName = moduleName;
        }
    }
}