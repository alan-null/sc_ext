/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';
    export function NavigationDirective(): ng.IDirective {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'views/snippets/navigation.html'
        };
    }
}