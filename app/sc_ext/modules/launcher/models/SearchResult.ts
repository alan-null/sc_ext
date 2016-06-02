/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Models {
    export class SearchResult {
        command: ICommand
        score: number;
        term: string;
        highlightedTerm: string;
    }
}