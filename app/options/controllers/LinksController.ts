/// <reference path='../_all.ts' />

module SitecoreExtensions.Options {
    'use strict';

    export class LinksController {
        public static $inject = ['$scope', 'linkStorage'];

        private links: LinkItem[];

        constructor(private $scope: ILinkScope, private linksStorage: ILinksStorage) {
            this.links = $scope.links = linksStorage.get((links) => {
                this.links = $scope.links = links;
            });

            $scope.name = '';
            $scope.url = '';
            $scope.mode = 'newtab';
            $scope.editedLink = null;
            $scope.order = 0;

            $scope.vm = this;

            $scope.$watch('links', () => this.onLinks(), true);

        }

        onLinks() {
            this.linksStorage.put(this.links);
        }

        addLink() {
            var name: string = this.$scope.name.trim();
            if (!name.length) {
                return;
            }

            var url: string = this.$scope.url.trim();
            if (!url.length) {
                return;
            }

            var mode: string = this.$scope.mode.trim();
            if (!mode.length) {
                return;
            }

            this.links.push(new LinkItem(name, url, mode, 0));

            this.$scope.name = '';
            this.$scope.url = '';
            this.$scope.mode = 'currenttab';
            this.$scope.order = 0;
        }

        editLink(linkItem: LinkItem) {
            this.$scope.editedLink = linkItem;
            this.$scope.originalLink = angular.extend({}, linkItem);
        }

        doneEditing(linkItem: LinkItem) {
            this.$scope.editedLink = null;
            this.$scope.originalLink = null;
            if (this.$scope.reverted) {
                this.$scope.reverted = null;
                return;
            }
            linkItem.name = linkItem.name.trim();
            if (!linkItem.name) {
                this.removeLink(linkItem);
            }
        }

        removeLink(linkItem: LinkItem) {
            this.links.splice(this.links.indexOf(linkItem), 1);
        }
    }
}
