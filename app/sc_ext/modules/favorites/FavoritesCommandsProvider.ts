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
            return [this.createFavoritesCommand(), this.createAddCommand(), this.createRemoveCommand(), this.createClearCommand()];
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
                key: favorite.host + '|' + favorite.database + '|' + favorite.id,
                title: favorite.name,
                description: this.getDescription(favorite),
                icon: favorite.icon,
                keepLauncherOpen: false,
                execute: (evt: UserActionEvent) => this.navigate(favorite, evt)
            });
        }

        private createAddCommand(): DynamicCommand {
            var command = new DynamicCommand('Add to favorites', '', '');
            command.descriptionGetter = _ => 'Save ' + this.module.getCurrentItemName();
            command.canExecuteCallback = () => this.module.canCapture() && !this.module.isCurrentFavorite();
            command.executeCallback = _ => { this.module.addCurrent(); };
            return command;
        }

        private createRemoveCommand(): DynamicCommand {
            var command = new DynamicCommand('Remove from favorites', '', '');
            command.descriptionGetter = _ => 'Remove ' + this.module.getCurrentItemName();
            command.canExecuteCallback = () => this.module.canCapture() && this.module.isCurrentFavorite();
            command.executeCallback = _ => { this.module.removeCurrent(); };
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
            var sameHost = favorite.host == window.top.location.host;
            var sameDatabase = favorite.database == Context.Database();
            var sameLanguage = favorite.language == Context.Language();
            if (sameHost && sameDatabase && sameLanguage && Context.Location() == Enums.Location.ContentEditor && !(evt && evt.ctrlKey)) {
                new PageObjects.ContentTree().loadItem(favorite.id);
                return;
            }

            var origin = window.top.location.protocol + '//' + favorite.host;
            var url = origin + '/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1&fo=' + encodeURIComponent(favorite.id);
            if (favorite.language) url += '&la=' + encodeURIComponent(favorite.language);
            if (favorite.database) url += '&sc_content=' + encodeURIComponent(favorite.database);
            new NavigationCommand('', '', url).execute(evt);
        }

        private getDescription(favorite: Favorite): string {
            var description = favorite.path || ((favorite.database || '') + ' ' + favorite.id).trim();
            if (favorite.host != window.top.location.host) description += ' (' + favorite.host + ')';
            return description;
        }
    }
}