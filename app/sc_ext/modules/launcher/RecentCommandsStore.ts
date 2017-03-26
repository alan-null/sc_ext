/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher {
    import GlobalStorage = SitecoreExtensions.Storage.GlobalStorage;
    export class RecentCommandsStore {
        array: Array<string>;
        recentCommandsKey: string = "sc_ext::recent_commands";
        private storageType: StorageType;

        constructor(historyCount: number, storageType: StorageType) {
            this.array = this.getArrayWithLimitedLength<string>(historyCount);
            this.storageType = storageType;
        }

        add(command: ICommand): void {
            this.array = this.array.filter((name) => { return name != command.name; });
            this.array.push(command.name);

            let storageValue = this.array.slice(-50).join('|');
            if (this.storageType == StorageType.GlobalStorage) {
                let options = new Options.ModuleOptionsBase(this.recentCommandsKey, {
                    value: storageValue
                });
                GlobalStorage.set(this.recentCommandsKey, storageValue);
            } else {
                localStorage.setItem(this.recentCommandsKey, storageValue);
            }
        }

        async getRecentCommands(commands: ICommand[]) {
            if (this.array.length == 0) {
                if (this.storageType == StorageType.GlobalStorage) {
                    let options = await GlobalStorage.get(this.recentCommandsKey);
                    if (options) {
                        this.array = options.split('|').filter((x) => { return x.length > 0; });
                    }
                } else {
                    var recentCommands = localStorage.getItem(this.recentCommandsKey);
                    await (async () => {
                        if (recentCommands) {
                            this.array = recentCommands.split('|').filter((x) => { return x.length > 0; });
                        }
                    })();
                }
            }

            let result = new Array<ICommand>();
            this.array.forEach(commandName => {
                let command = commands.filter(c => c.name == commandName && c.canExecute())[0];
                if (command) {
                    result.push(command);
                }
            });

            return [].concat(result).reverse();
        }

        private getArrayWithLimitedLength<T>(length): Array<T> {
            var array = new Array<T>();
            array.push = function () {
                if (this.length >= length) {
                    this.shift();
                }
                return Array.prototype.push.apply(this, arguments);
            };
            return array;
        }
    }
}