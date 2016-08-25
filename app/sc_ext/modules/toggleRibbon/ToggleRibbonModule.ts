/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.ToggleRibbon {


    export class ToggleRibbonModule extends ModuleBase implements ISitecoreExtensionsModule {
        ribbon: Ribbon;
        toggleButton: ToggleButton;

        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        private isVisible() {
            var scRibbon = top.window.document.cookie.replace(/(?:(?:^|.*;\s*)scRibbon\s*\=\s*([^;]*).*$)|^.*$/, "$" + "1");
            return scRibbon === '1' || scRibbon.length == 0;
        }

        private hide() {
            this.ribbon.hide()
            this.saveRibbonState(0)
            this.toggleButton.updatePosition(this.isVisible())
        }

        private show() {
            this.ribbon.show();
            this.saveRibbonState(1)
            this.toggleButton.updatePosition(this.isVisible())
        }

        private toggle() {
            this.isVisible() ? this.hide() : this.show()
        }

        private refresh() {
            this.isVisible() ? this.show() : this.hide();
        }

        private saveRibbonState(value: number) {
            top.window.document.cookie = 'scRibbon=' + value;
        }

        canExecute(): boolean {
            return this.options.enabled
                && Context.Location() == Enums.Location.ExperienceEditor
                && document.querySelector('#scWebEditRibbon') != null;
        }

        initialize(): void {
            this.ribbon = new Ribbon()
            this.toggleButton = new ToggleButton(() => {
                this.toggle();
            });
            this.toggleButton.hide()

            SitecoreExtensions.HTMLHelpers.postponeAction(() => {
                return this.ribbon.isInitialized();
            }, () => {
                this.refresh();
                this.toggleButton.show();
            }, 200, 30);
        }
    }
}
