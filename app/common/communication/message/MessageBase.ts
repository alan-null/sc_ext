namespace SitecoreExtensions.Common.Communication {
    export class MessageBase {
        public readonly applicationID: string = "SitecoreExtensions";
        protected classNameString: string;

        constructor() {
            this.assignClassName();
        }

        protected assignClassName() {
            this.classNameString = (this as any).constructor.name;
        }
    }
}