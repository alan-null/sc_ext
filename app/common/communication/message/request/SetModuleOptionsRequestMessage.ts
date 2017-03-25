/// <reference path='../MessageBase.ts' />

import IModuleOptions = SitecoreExtensions.Options.IModuleOptions;
namespace SitecoreExtensions.Common.Communication {
    export class SetModuleOptionsRequestMessage extends MessageBase {
        moduleOptions: IModuleOptions = null;

        constructor(moduleOptions: IModuleOptions) {
            super();
            this.moduleOptions = moduleOptions;
        }
    }
}