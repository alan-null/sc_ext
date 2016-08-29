/// <reference path='../../../_all.ts'/>

namespace SitecoreExtensions.Modules.Launcher.Models {
    export class SearchResult {
        command: ICommand;
        score: number;
        term: string;
        highlightedTerm: string;

        public static Cast(command: ICommand): SearchResult {
            if (command != null) {
                var sr = <SearchResult> {
                    command: command,
                    score: 200,
                    term: command.name,
                    highlightedTerm: command.name,
                };
                return sr;
            }
        }
    }
}