namespace SitecoreExtensions.Modules.Launcher {
    export interface INestedCommand extends ICommand {
        isNested: boolean;
        placeholder: string;
        getNestedItems(query: string): Promise<Models.NestedItem[]>;
    }

    export function isNestedCommand(command: ICommand): command is INestedCommand {
        return command != null && (<INestedCommand>command).isNested === true;
    }
}