/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ScrollToItem {
    export class ScrollToItemModule extends ModuleBase implements ISitecoreExtensionsModule {

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            SitecorePageBridge.on('page:changed', () => { this.scrollToActiveItemAfterChange(); });
        }

        private scrollToActiveItemAfterChange() {
            let contentTree = new PageObjects.ContentTree();
            contentTree.onActiveTreeNodeChanged(_ => {
                contentTree.scrollToActiveNode();
            });
        }
    }
}