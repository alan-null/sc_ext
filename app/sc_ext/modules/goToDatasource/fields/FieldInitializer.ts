/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.GoToDatasource.Fields {
    export interface FieldInitializer {
        (select: HTMLSelectElement): IDatasourceField;
    }
}