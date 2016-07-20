/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher {
    export class RecentCommandsStore {
        array: Array<string>;
        recentCommandsKey: string = "sc_ext::recent_commands"

        constructor(historyCount: number) {
            this.array = this.getArrayWithLimitedLength<string>(historyCount);
        }

        private getArrayWithLimitedLength<T>(length): Array<T> {
            var array = new Array<T>();
            array.push = function () {
                if (this.length >= length) {
                    this.shift();
                }
                return Array.prototype.push.apply(this, arguments);
            }
            return array;
        }

        add(command: ICommand): void {
            this.array = this.array.filter((name) => { return name != command.name; })
            this.array.push(command.name)
            localStorage.setItem(this.recentCommandsKey, this.array.join('|'));
        }

        getRecentCommands(commands: ICommand[]) {
            if (this.array.length == 0) {
                var recentCommands = localStorage.getItem(this.recentCommandsKey);
                this.array = recentCommands.split('|').filter((x) => { return x.length > 0 });
            }

            let result = new Array<ICommand>();
            this.array.forEach(commandName => {
                let command = commands.filter(c => c.name == commandName && c.canExecute())[0];
                if (command) {
                    result.push(command)
                }
            });

            return [].concat(result).reverse();
        }
    }
}