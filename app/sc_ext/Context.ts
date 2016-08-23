/// <reference path='_all.ts'/>

namespace SitecoreExtensions {
    import Location = SitecoreExtensions.Enums.Location;

    export class Context {
        database: string;
        itemID: string;
        constructor() { }

        static IsValid(): boolean {
            return window.location.pathname.indexOf('/sitecore/') == 0 || Context.Location() == Location.ExperienceEditor;
        }

        static GetCurrentItem(): string {
            var element = <HTMLInputElement>document.querySelector('#__CurrentItem');
            return element.value;
        }

        static Database(): string {
            var pageMode = this.Location();
            if (pageMode == Location.ContentEditor) {
                var value = this.GetCurrentItem();
                return value.split('/').slice(2, 3)[0];
            }
            if (pageMode == Location.Desktop) {
                return (document.querySelector('.scDatabaseName') as HTMLDivElement).innerText;
            }
            if (pageMode == Location.ExperienceEditor) {
                var webEditRibbonIFrame = (document.querySelector('#scWebEditRibbon') as HTMLIFrameElement)
                if (webEditRibbonIFrame != null) {
                    var src = webEditRibbonIFrame.src
                    var start = src.indexOf("database=");
                    var end = src.indexOf("&", start);
                    return src.slice(start + 9, end)
                }
                var peBar = document.querySelector('[data-sc-id=PageEditBar]');
                if (peBar != null) {
                    return peBar.attributes['data-sc-database'].value
                }
            }
            else {
                var contendDb = <HTMLMetaElement>document.querySelector('[data-sc-name=sitecoreContentDatabase]')
                if (contendDb != null) {
                    if (contendDb.attributes['data-sc-content'] != undefined) {
                        return contendDb.attributes['data-sc-content'].value
                    }
                }
            }
            return null;
        }

        static getQueryStringValue(queryString, key) {
            key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
            var match = queryString.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
            return match && decodeURIComponent(match[1].replace(/\+/g, " "));
        }

        static Language(): string {
            var pageMode = this.Location();
            if (pageMode == Location.ContentEditor) {
                return this.getQueryStringValue(this.GetCurrentItem(), "lang");
            }
            if (pageMode == Location.Desktop) {
                return document.querySelector("[lang]").attributes['lang'].value
            }
            if (pageMode == Location.ExperienceEditor) {
                var webEditRibbonIFrame = (document.querySelector('#scWebEditRibbon') as HTMLIFrameElement)
                if (webEditRibbonIFrame != null) {
                    var src = webEditRibbonIFrame.src
                    var start = src.indexOf("lang");
                    var end = src.indexOf("&", start);
                    return src.slice(start + 5, end)
                }
                var peBar = document.querySelector('[data-sc-id=PageEditBar]');
                if (peBar != null) {
                    return peBar.attributes['data-sc-content'].value
                }
            }
            else {
                var contendDb = <HTMLMetaElement>document.querySelector('[data-sc-name=sitecoreLanguage]')
                if (contendDb != null) {
                    if (contendDb.attributes['data-sc-content'] != undefined) {
                        return contendDb.attributes['data-sc-content'].value
                    }
                }
            }
            return null;
        }

        static ItemID(): string {
            var value = this.GetCurrentItem();
            return value.match(/{.*}/)[0];
        }

        static Location(): Location {
            if (typeof scContentEditor != 'undefined') {
                if (document.querySelector('#__CurrentItem') != undefined) {
                    return Location.ContentEditor;
                }
            }
            if (document.querySelector('.sc-launchpad') !== null) {
                return Location.Launchpad;
            }
            let frameName = document.querySelector('input#__FRAMENAME') as HTMLInputElement
            if (frameName !== null && frameName.value == "Shell") {
                return Location.Desktop;
            }
            if (document.querySelector('#scWebEditRibbon') !== null || document.querySelector('[data-sc-id=PageEditBar]') != null) {
                return Location.ExperienceEditor;
            }
            return Location.Unknown;
        }
    }
}