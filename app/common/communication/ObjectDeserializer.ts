namespace SitecoreExtensions.Common.Communication {
    export class ObjectDeserializer {
        public deserialize<T>(data: any): T {
            let instance = new SitecoreExtensions.Common.Communication[data.classNameString]();
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