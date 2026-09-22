/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Guid {
    import ICommand = Launcher.ICommand;
    import INestedCommand = Launcher.INestedCommand;
    import NestedItem = Launcher.Models.NestedItem;
    import UserActionEvent = Launcher.Providers.UserActionEvent;

    export class GuidCommandsProvider implements Launcher.Providers.ICommandsProvider {
        private enabled: boolean;
        private sourceGuid: string = null;

        constructor(rawOptions?: Options.IModuleOptions) {
            this.enabled = rawOptions == null || rawOptions.model == null || rawOptions.model.enabled !== false;
        }

        getCommands(): ICommand[] {
            var command: INestedCommand = {
                id: 0,
                name: 'GUID',
                description: 'Copy the current item ID in a common GUID format',
                isNested: true,
                placeholder: 'Select a format',
                execute: _ => { },
                canExecute: () => {
                    return this.enabled && this.getCurrentItemId() != null;
                },
                getNestedItems: _ => {
                    var sourceGuid = this.sourceGuid || this.getCurrentItemId();
                    return Promise.resolve(sourceGuid == null ? [] : this.buildItems(sourceGuid));
                }
            };
            return [command];
        }

        private buildItems(sourceGuid: string): NestedItem[] {
            var items = GuidFormatter.format(sourceGuid).map(format => {
                return <NestedItem>{
                    key: format.key,
                    title: format.title,
                    description: format.value,
                    icon: null,
                    keepLauncherOpen: false,
                    execute: (_: UserActionEvent) => this.copy(format.value)
                };
            });
            items.push(<NestedItem>{
                key: 'new-random-guid',
                title: 'New random GUID',
                description: 'Generate a new GUID and show all formats',
                icon: null,
                keepLauncherOpen: true,
                execute: (_: UserActionEvent) => {
                    this.sourceGuid = this.generateGuid();
                    this.getLauncher().refreshNested();
                    this.sourceGuid = null;
                }
            });
            return items;
        }

        private copy(value: string): void {
            HTMLHelpers.copyTextToClipboard(value);
            Notification.Instance.info({
                message: '<b>GUID:</b></br><code>' + value + '</code></br>copied to the clipboard',
                position: 'topRight', backgroundColor: 'rgba(157,222,255,0.97)', progressBar: false
            });
        }

        private generateGuid(): string {
            var cryptoApi = <any>window.crypto;
            if (cryptoApi.randomUUID) {
                return cryptoApi.randomUUID();
            }

            var bytes = new Uint8Array(16);
            cryptoApi.getRandomValues(bytes);
            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;
            var hex = Array.prototype.map.call(bytes, value => ('0' + value.toString(16)).slice(-2)).join('');
            return hex.substring(0, 8) + '-' + hex.substring(8, 12) + '-' + hex.substring(12, 16) + '-' +
                hex.substring(16, 20) + '-' + hex.substring(20);
        }

        private getLauncher(): Launcher.LauncherModule {
            return <Launcher.LauncherModule>scExtManager.getModule(Launcher.LauncherModule);
        }

        private getCurrentItemId(): string {
            if (Context.Location() != Enums.Location.ContentEditor) return null;
            try {
                return Context.ItemID();
            } catch (_) {
                return null;
            }
        }
    }
}