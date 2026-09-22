namespace SitecoreExtensions.Common.Communication {
    export class ObjectDeserializer {
        public deserialize<T>(data: any): T {
            let constructors: any = {
                GetOptionsRequestMessage: GetOptionsRequestMessage,
                GetModuleOptionsRequestMessage: GetModuleOptionsRequestMessage,
                SetOptionsRequestMessage: SetOptionsRequestMessage,
                SetModuleOptionsRequestMessage: SetModuleOptionsRequestMessage,
                GetGlobalStorageRequestMessage: GetGlobalStorageRequestMessage,
                SetGlobalStorageRequestMessage: SetGlobalStorageRequestMessage,
                GetOptionsResponseMessage: GetOptionsResponseMessage,
                GetModuleOptionsResponseMessage: GetModuleOptionsResponseMessage,
                GetGlobalStorageResponseMessage: GetGlobalStorageResponseMessage
            };
            let MessageConstructor = data && constructors[data.classNameString];
            if (!MessageConstructor) {
                return null;
            }
            let instance = new MessageConstructor();
            instance = this.mapOptions<T>(data, instance);
            return instance as T;
        }

        mapOptions<T>(rawOptions: any, options: T): T {
            for (var f in rawOptions) {
                if (options.hasOwnProperty(f)) {
                    options[f] = rawOptions[f];
                }
            }
            return options;
        }
    }
}