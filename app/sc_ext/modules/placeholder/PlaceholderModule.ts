
namespace SitecoreExtensions.Modules.Placeholder {
    export class PlaceholderModule extends ModuleBase implements ISitecoreExtensionsModule {
        private readonly initKey: string = 'sc_ext_initialized';
        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        public static removeRenderings(placeholderID: string) {
            let phChrome = [].find.call(Sitecore.PageModes.DesignManager.placeholders(), function (chrome) {
                return chrome.isEnabled() && chrome._originalDOMElement.context.attributes.key.value == placeholderID;
            });
            [].forEach.call(phChrome.getChildChromes(), (renderingChrome) => { phChrome.type.deleteControl(renderingChrome); });
            [].forEach.call(this.getStaleRenderings(placeholderID), (r: Rendering) => { r.remove(); });
        }

        private static getStaleRenderings(placeholderID: string): Array<Rendering> {
            return [].filter.call(this.getAllRenderings(), (r: Rendering) => {
                return r.placeholder.match(new RegExp(placeholderID, "g")) != null;
            });
        }

        private static getAllRenderings(): Array<Rendering> {
            return [].map.call(Sitecore.LayoutDefinition.getRenderings(), (r: any) => { return new Rendering(r); }) as Array<Rendering>;
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ExperienceEditor && Sitecore.PageModes != null;
        }

        initialize(): void {
            HTMLHelpers.addProxy(Sitecore.PageModes.ChromeManager, "resetChromes", () => {
                this.getPlaceholders().forEach((placeholder: PlaceholderChrome) => {
                    let placeholderID = placeholder.getPlaceholderId();

                    let removeCommand = this.buildRemoveCommand(placeholderID);
                    placeholder.addCommand(removeCommand);
                    placeholder.chrome.data[this.initKey] = true;
                });
            });
        }

        protected getPlaceholders(): Array<PlaceholderChrome> {
            let allPlaceholders = Sitecore.PageModes.DesignManager.placeholders();
            let placeholders = [].filter.call(allPlaceholders, (chrome: any) => { return chrome.data[this.initKey] == null; });
            return [].map.call(placeholders, (p: any) => { return new PlaceholderChrome(p); }) as Array<PlaceholderChrome>;
        }

        protected buildRemoveCommand(placeholderID: string): IPlaceholderCommand {
            const removeCommand: IPlaceholderCommand = {
                click: `SitecoreExtensions.Modules.Placeholder.PlaceholderModule.removeRenderings('${placeholderID}')`,
                header: 'Remove',
                icon: '/temp/iconcache/office/16x16/delete.png',
                disabledIcon: '/temp/add_disabled16x16.png',
                isDivider: false,
                tooltip: `Remove all renderings from the '${placeholderID}' placeholder.`,
                type: ""
            };
            return removeCommand;
        }
    }
}
