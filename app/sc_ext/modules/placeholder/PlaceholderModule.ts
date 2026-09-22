
namespace SitecoreExtensions.Modules.Placeholder {
    export class PlaceholderModule extends ModuleBase implements ISitecoreExtensionsModule {
        constructor(name: string, description: string, rawOptions: Options.ModuleOptionsBase) {
            super(name, description, rawOptions);
        }

        canExecute(): boolean {
            return this.options.enabled && Context.Location() == Enums.Location.ExperienceEditor;
        }

        initialize(): void {
            SitecorePageBridge.invoke('placeholder', 'initialize');
        }
    }
}
