/// <reference path='../../_all.ts'/>

namespace SitecoreExtensions.Modules.AddHere {
    export class AddHereModule extends ModuleBase implements ISitecoreExtensionsModule {
        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ExperienceEditor;
        }

        initialize(): void {
            if (window["Sitecore"] != null && Sitecore.PageModes != null) {
                HTMLHelpers.addProxy((Sitecore.PageModes.DesignManager as any), 'insertionStart', () => { this.refreshControls(); });
            }
        }

        getAddHereButtons(): Array<AddHereButton> {
            var elements = document.querySelectorAll('.scInsertionHandleLeft.scAddToHere:not(.sc-ext-addHere-button-initialized)') as NodeListOf<HTMLDivElement>;
            return Array.from(Array.prototype.slice.call(elements) as Array<HTMLDivElement>, e => new AddHereButton(e));
        }

        refreshControls(): void {
            var addHereButtons = this.getAddHereButtons();
            if (addHereButtons.length === 0) {
                return;
            }

            addHereButtons.forEach(button => {
                let buttons = addHereButtons.filter(function (b) { return b.placeholderName == button.placeholderName; });
                let txt = button.getText() + " | " + button.placeholderName;
                if (buttons.length > 1) {
                    let index = buttons.indexOf(button) + 1;
                    txt = txt + "(" + index + ")";
                }
                button.setText(txt);
            });
        }
    }
}
