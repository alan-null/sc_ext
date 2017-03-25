namespace SitecoreExtensions.Common.Communication {
    export class DataParser {
        public tryParse<T>(data: any): T {
            if (this.validate(data)) {
                let deserializer = new SitecoreExtensions.Common.Communication.ObjectDeserializer();
                let instance = deserializer.deserialize<T>(data);
                return instance;
            }
        }
        private validate(data: any): boolean {
            return data != null && data.applicationID && data.applicationID == "SitecoreExtensions";
        }
    }
}