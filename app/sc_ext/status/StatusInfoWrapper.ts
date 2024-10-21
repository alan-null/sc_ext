/// <reference path="../_all.ts"/>

namespace SitecoreExtensions {
    export class StatusInfoWrapper {
        private static instance: StatusInfoWrapper;
        private moduleStatusProviderInstance: Status.ModulesStatusProvider | null = null;
        private commandStatusProviderInstance: Status.CommandsStatusProvider | null = null;

        private constructor() { }

        public static getInstance(): StatusInfoWrapper {
            if (!StatusInfoWrapper.instance) {
                StatusInfoWrapper.instance = new StatusInfoWrapper();
            }
            return StatusInfoWrapper.instance;
        }

        public clear(): void {
            this.status = null;
        }

        public update(): void {
            this.status = {
                modules_count: this.moduleStatusProvider.getStatus(),
                commands_count: this.commandStatusProvider.getStatus()
            };
        }

        public get moduleStatusProvider(): Status.ModulesStatusProvider {
            if (!this.moduleStatusProviderInstance) {
                this.moduleStatusProviderInstance = new Status.ModulesStatusProvider();
            }
            return this.moduleStatusProviderInstance;
        }

        public get commandStatusProvider(): Status.CommandsStatusProvider {
            if (!this.commandStatusProviderInstance) {
                this.commandStatusProviderInstance = new Status.CommandsStatusProvider();
            }
            return this.commandStatusProviderInstance;
        }

        get status(): any { // Replace `any` with the actual type of statusInfo
            return (window.top as any).SitecoreExtensions.statusInfo;
        }

        set status(value: any) {
            (window.top as any).SitecoreExtensions.statusInfo = value;
        }
    }
}