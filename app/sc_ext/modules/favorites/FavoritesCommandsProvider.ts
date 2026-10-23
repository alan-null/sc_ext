/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.Favorites {
    import ICommand = Launcher.ICommand;
    import INestedCommand = Launcher.INestedCommand;
    import NestedItem = Launcher.Models.NestedItem;
    import DynamicCommand = Launcher.Providers.DynamicCommand;
    import NavigationCommand = Launcher.Providers.NavigationCommand;
    import UserActionEvent = Launcher.Providers.UserActionEvent;

    export class FavoritesCommandsProvider implements Launcher.Providers.ICommandsProvider {
        constructor(private module: FavoritesModule) { }

        public getCommands(): ICommand[] {
            return [this.createFavoritesCommand(), this.createAddCommand(), this.createRemoveCommand(),
                this.createScopeCommand(), this.createManageCommand(), this.createClearCommand()];
        }

        private createFavoritesCommand(): INestedCommand {
            return <INestedCommand>{
                id: 0,
                name: 'Favorites',
                description: 'Open a saved Content Editor item',
                isNested: true,
                placeholder: 'Select an item',
                execute: _ => { },
                canExecute: () => this.module.options.enabled,
                getNestedItems: _ => this.getFavoriteItems()
            };
        }

        private async getFavoriteItems(): Promise<NestedItem[]> {
            var favorites = await this.module.store.all();
            if (favorites.length == 0) {
                return [<NestedItem>{
                    key: '__no_results', title: 'No favorites saved', description: '', icon: null,
                    keepLauncherOpen: true, execute: _ => { }
                }];
            }
            return favorites.map(favorite => <NestedItem>{
                key: Favorite.key(favorite),
                title: favorite.name,
                description: this.getDescription(favorite),
                icon: Favorite.iconUrl(favorite, window.top.location.host, window.top.location.protocol),
                keepLauncherOpen: false,
                execute: (evt: UserActionEvent) => this.navigate(favorite, evt)
            });
        }

        private createAddCommand(): DynamicCommand {
            var command = new DynamicCommand('Add to favorites', '', '');
            command.descriptionGetter = _ => 'Save ' + this.module.getCurrentItemName() +
                (this.module.options.defaultScope == 'any' ? ' for any instance' : ' for this instance');
            command.canExecuteCallback = () => this.module.canCapture() && !this.module.isCurrentFavorite();
            command.executeCallback = _ => { this.module.addCurrent(); };
            return command;
        }

        private createRemoveCommand(): DynamicCommand {
            var command = new DynamicCommand('Remove from favorites', '', '');
            command.descriptionGetter = _ => 'Remove ' + this.module.getCurrentItemName() +
                (this.module.currentFavorite() && this.module.currentFavorite().scope == 'any' ? ' from all instances' :
                    this.module.currentFavorite() && this.module.currentFavorite().scope == 'matching' ? ' from matching instances' : '');
            command.canExecuteCallback = () => this.module.canCapture() && this.module.isCurrentFavorite();
            command.executeCallback = _ => { this.module.removeCurrent(); };
            return command;
        }

        private createScopeCommand(): DynamicCommand {
            var command = new DynamicCommand('Change favorite scope', '', '');
            command.descriptionGetter = _ => this.module.currentFavorite() &&
                (this.module.currentFavorite().scope == 'any' || this.module.currentFavorite().scope == 'matching')
                ? 'Use this favorite on this instance only' : 'Use this favorite on any instance';
            command.canExecuteCallback = () => this.module.canCapture() && this.module.isCurrentFavorite();
            command.executeCallback = _ => { this.module.changeCurrentScope(); };
            return command;
        }

        private createManageCommand(): DynamicCommand {
            var command = new DynamicCommand('Manage favorites', '', '');
            command.descriptionGetter = _ => 'Edit extension-stored favorites in Options';
            command.canExecuteCallback = () => this.module.options.enabled;
            command.executeCallback = _ => {
                chrome.runtime.sendMessage({ sc_ext_openTab_request: true,
                    url: chrome.runtime.getURL('options/options.html?module=favorites'), active: true });
            };
            return command;
        }

        private createClearCommand(): INestedCommand {
            return <INestedCommand>{
                id: 0,
                name: 'Clear favorites',
                description: 'Remove every saved favorite',
                isNested: true,
                placeholder: 'Confirm clear',
                execute: _ => { },
                canExecute: () => this.module.options.enabled,
                getNestedItems: _ => Promise.resolve([<NestedItem>{
                    key: 'confirm-clear-favorites',
                    title: 'Clear all favorites',
                    description: 'Press Enter again to confirm',
                    icon: null,
                    keepLauncherOpen: false,
                    execute: _ => { this.module.clear(); }
                }])
            };
        }

        private navigate(favorite: Favorite, evt: UserActionEvent): void {
            var host = Favorite.targetHost(favorite, window.top.location.host);
            var sameHost = host == window.top.location.host;
            var sameDatabase = favorite.database == Context.Database();
            var sameLanguage = favorite.language == Context.Language();
            if (sameHost && sameDatabase && sameLanguage && Context.Location() == Enums.Location.ContentEditor && !(evt && evt.ctrlKey)) {
                new PageObjects.ContentTree().loadItem(favorite.id);
                return;
            }

            var origin = window.top.location.protocol + '//' + host;
            var url = origin + '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=' + encodeURIComponent(favorite.id);
            if (favorite.language) url += '&la=' + encodeURIComponent(favorite.language);
            if (favorite.database) url += '&sc_content=' + encodeURIComponent(favorite.database);
            new NavigationCommand('', '', url).execute(evt);
        }

        private getDescription(favorite: Favorite): string {
            var description = favorite.path || ((favorite.database || '') + ' ' + favorite.id).trim();
            if (favorite.scope == 'any') description += ' (Any instance)';
            else if (favorite.scope == 'matching') description += ' (Matching instances: ' + favorite.hostPattern + ')';
            else if (favorite.host != window.top.location.host) description += ' (' + favorite.host + ')';
            return description;
        }
    }
}
