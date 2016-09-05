/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeAutoExpand {
    export class TreeAutoExpandModule extends ModuleBase implements ISitecoreExtensionsModule {

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ContentEditor;
        }

        initialize(): void {
            this.addTreeNodeHandlers('scContentTree');
        }

        addTreeNodeHandlers(className: string): void {
            var nodes = document.getElementsByClassName(className);
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].addEventListener('click', (evt: MouseEvent) => {
                    setTimeout(() => {
                        this.expandSubTree(evt);
                    }, 10);
                });
            }
        }

        expandSubTree(evt: MouseEvent): void {
            let glyphId = evt.srcElement.id;
            let icon = new TreeNodeGlyph(glyphId);

            if (icon.isExpandable()) {
                HTMLHelpers.postponeAction(_ => { return this.predicate(glyphId); }, _ => { this.action(glyphId); }, 100, 10);
            }
        }

        private predicate(glyphId: string): boolean {
            return new TreeNodeGlyph(glyphId).isExpanded();
        }

        private action(glyphId: string): void {
            let icon = new TreeNodeGlyph(glyphId);
            let childNodeds = icon.getChildren();
            if (childNodeds.length == 1) {
                (childNodeds[0].querySelector(".scContentTreeNodeGlyph") as HTMLImageElement).click();
            }
        }
    }
}