/// <reference path='../MessageBase.ts' />

namespace SitecoreExtensions.Common.Communication {
    export class GetOptionsResponseMessage extends MessageBase {
        optionsWrapper: SitecoreExtensions.Options.OptionsWrapper = null;
        constructor() {
            super();
        }
    }
}