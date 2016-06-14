/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Status {
    export interface IStatusProvider {
        getStatus(): string;
    }
}