/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.FavouriteItems {
    import DatabaseChangeEventArgs = Events.DatabaseChangeEventArgs;
    import Popup = SitecoreExtensions.Modules.TreeScope.Popup;
    import PopupButton = SitecoreExtensions.Modules.TreeScope.PopupButton;
    import ContentEditorTree = SitecoreExtensions.Modules.TreeScope.ContentEditorTree;

    export class FavouriteItemsModule extends ModuleBase implements ISitecoreExtensionsModule {
        private favouriteItemsClass: string = "sc-ext-favourite-items";
        private idScopedElement: string = "sc-ext-treescope-scoped-node";
        commands: IFavouriteItem[];
        recentCommandsStore: FavouriteItemsStore;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
            this.commands = new Array<IFavouriteItem>();
            this.recentCommandsStore = new FavouriteItemsStore(10, Launcher.StorageType.LocalStorage);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            HTMLHelpers.addProxy(scForm, 'invoke', (e) => { this.insertTreeScopeButton(e); });

        }

        private addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt) => {
                    setTimeout(() => {
                        this.insertTreeScopeButton(evt);
                    }, 10);
                });
            }
        }

        private insertTreeScopeButton(e): void {
            if (document.getElementsByClassName(this.favouriteItemsClass).length > 0) {
                return;
            }
            let popup = new Popup(document.querySelector(".scPopup") as HTMLDivElement);
            if (popup.popupElement == null) {
                return;
            }

            let activeNodeID = this.getActiveTreeNodeID(e[0]);



            (async () => {
                await this.recentCommandsStore.getRecentCommands(this.commands)
                console.log(this.recentCommandsStore.array);

                if (this.recentCommandsStore.array.indexOf(activeNodeID) == -1) {
                    let scopeButton = new PopupButton(activeNodeID, (e) => {
                        console.log("Adding following node to favourites: " + activeNodeID);
                        var item: IFavouriteItem = {
                            id: -1,
                            name: activeNodeID,
                            icon: "sss"
                        };
                        this.recentCommandsStore.add(item);
                        popup.hide();
                    });
                    scopeButton.iconImage = "/~/icon/People/32x32/cube_green_add.png";
                    scopeButton.captionText = "Favourite";
                    scopeButton.hotkeyImage = "/sitecore/images/blank.gif";
                    scopeButton.buttonClass = this.favouriteItemsClass;
                    popup.appendPopupButton(scopeButton, popup.getIndexOfElement("__Refresh"));
                }
                else {
                    let descopeButton = new PopupButton(activeNodeID, (e) => {
                        // this.descopeTreeCallback(e);
                        console.log("Removing following node to favourites: " + activeNodeID);
                        this.recentCommandsStore.remove(activeNodeID);
                        // let indexToRemove = this.recentCommandsStore.array.indexOf(activeNodeID);
                        // if (indexToRemove > -1) {
                        //     this.recentCommandsStore.array.splice(indexToRemove, 1);
                        // }
                        popup.hide();
                    });
                    descopeButton.iconImage = "/~/icon/People/32x32/cube_yellow_delete.png";
                    descopeButton.captionText = "Unfavourite";
                    descopeButton.hotkeyImage = "/sitecore/images/blank.gif";
                    descopeButton.buttonClass = this.favouriteItemsClass;
                    popup.appendPopupButton(descopeButton, popup.getIndexOfElement("__Refresh"));
                }
            })();




        };

        private scopeTreeCallback(activeNodeID: string) {
            console.log("Adding following node to favourites: " + activeNodeID);

            // let activeNode = document.querySelector("#" + activeNodeID).parentNode;
            // let tree = new ContentEditorTree();
            // let nodeClode = activeNode.cloneNode(true) as HTMLDivElement;
            // nodeClode.id = this.idScopedElement;

            // tree.hide();
            // tree.addTreeNode(nodeClode);
        }

        private descopeTreeCallback(activeNodeID: string) {
            let scopedElement = document.querySelector("#" + this.idScopedElement);
            let tree = new ContentEditorTree();

            tree.show();
            scopedElement.remove();
        }

        private getActiveTreeNodeID(value: string): string {
            return value.match(/Tree_Node_[A-Z0-9]*/)[0];
        }
    }
}
