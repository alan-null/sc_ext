/// <reference path='../MessageBase.ts' />

import OptionsWrapper = SitecoreExtensions.Options.OptionsWrapper;

namespace SitecoreExtensions.Common.Communication {
    export class SetOptionsRequestMessage extends MessageBase {
        options: IModuleOptions[] = null;
        constructor(options: IModuleOptions[]) {
            super();
            this.options = options;
        }
    }
}