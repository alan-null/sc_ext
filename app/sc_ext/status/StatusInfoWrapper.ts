'use strict';
namespace SitecoreExtensions {
    export class StatusInfoWrapper {
        private static instance: StatusInfoWrapper;
        private _moduleStatusProvider: Status.ModulesStatusProvider | null = null;
        private _commandStatusProvider: Status.CommandsStatusProvider | null = null;

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
            if (!this._moduleStatusProvider) {
                this._moduleStatusProvider = new Status.ModulesStatusProvider();
            }
            return this._moduleStatusProvider;
        }

        public get commandStatusProvider(): Status.CommandsStatusProvider {
            if (!this._commandStatusProvider) {
                this._commandStatusProvider = new Status.CommandsStatusProvider();
            }
            return this._commandStatusProvider;
        }

        get status(): any { // Replace `any` with the actual type of statusInfo
            return (window.top as any).SitecoreExtensions.statusInfo;
        }

        set status(value: any) {
            (window.top as any).SitecoreExtensions.statusInfo = value;
        }
    }
}