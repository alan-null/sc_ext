/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Providers {
    export class DynamicCommand extends BaseCommand implements ICommand {
        executeCallback: CommandExecuteCallback;
        canExecuteCallback: CommandCanExecuteCallback;
        descriptionGetter: CommandDescriptionCallback;
        staticDescription: string;

        get description(): string {
            if (this.descriptionGetter == null) {
                return this.staticDescription;
            } else {
                return this.descriptionGetter(this);
            }
        }
        constructor(name: string, description: string, url: string) {
            super(name, description, url);
            this.staticDescription = description;
        }
        canExecute(): boolean {
            if (this.canExecuteCallback) {
                return this.canExecuteCallback();
            }
            return false;
        }

        execute(evt: UserActionEvent): void {
            if (this.executeCallback) {
                this.executeCallback(this, evt);
            }
        }

        get ItemId(): string {
            return Context.ItemID();
        }

        get Database(): string {
            return Context.Database();
        }


        public get Lang(): string {
            return Context.Language();
        }
    }

    export interface CommandExecuteCallback {
        (cmd: DynamicCommand, evt: UserActionEvent): void;
    }

    export interface CommandDescriptionCallback {
        (cmd: DynamicCommand): string;
    }

    export interface CommandCanExecuteCallback {
        (): boolean;
    }
}