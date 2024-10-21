/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Options {
    export class ExtensionsOptions extends ModuleOptions {
        badge: {
            enabled: boolean,
            statusType: Status.StatusType
        } = { enabled: true, statusType: Status.StatusType.ModulesCount };

        statusInfo: {
            enabled: boolean,
        } = { enabled: false };

        constructor(wrapper: any) {
            super();
            if (wrapper != null) {
                this.enabled = wrapper.model.enabled;
                this.badge.enabled = wrapper.model.badge.enabled;
                this.badge.statusType = Status.StatusType[wrapper.model.badge.statusType as string];
                this.statusInfo.enabled = wrapper.model.statusInfo.enabled;
            };
        }
    }
}

