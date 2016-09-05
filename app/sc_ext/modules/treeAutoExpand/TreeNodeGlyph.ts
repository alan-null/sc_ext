/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.TreeAutoExpand {
    export class TreeNodeGlyph {
        private iconExpanded: string = "/sitecore/shell/themes/standard/images/treemenu_expanded.png";
        private iconNonExpand: string = "/sitecore/shell/themes/standard/images/noexpand15x15.gif";
        private iconCollapsed: string = "sitecore/shell/themes/standard/images/treemenu_collapsed.png";
        private treeNodeGlyphElement: HTMLImageElement;

        constructor(elementId: string) {
            this.treeNodeGlyphElement = document.getElementById(elementId) as HTMLImageElement;
        }

        isExpanded(): boolean {
            let isExpanded = this.treeNodeGlyphElement.src.endsWith(this.iconExpanded);
            return isExpanded;
        }

        isExpandable(): boolean {
            if (this.treeNodeGlyphElement && this.treeNodeGlyphElement.src) {
                return !this.treeNodeGlyphElement.src.endsWith(this.iconNonExpand) && !this.treeNodeGlyphElement.src.endsWith(this.iconCollapsed);
            } else {
                return false;
            }
        }

        getChildren() {
            return this.treeNodeGlyphElement.parentElement.querySelectorAll(".scContentTreeNode");
        }
    }
}