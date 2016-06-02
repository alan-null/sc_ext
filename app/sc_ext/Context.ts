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

        static ItemID(): string {
            var value = this.GetCurrentItem();
            return value.match(/{.*}/)[0];
        }

        static Location(): Location {
            if (typeof scContentEditor != 'undefined') {
                return Location.ContentEditor;
            }
            if (document.querySelector('.sc-launchpad') !== null) {
                return Location.Launchpad;
            }
            if (document.querySelector('input#__FRAMENAME') !== null) {
                return Location.Desktop;
            }
            if (document.querySelector('#scWebEditRibbon') !== null || document.querySelector('[data-sc-id=PageEditBar]') != null) {
                return Location.ExperienceEditor;
            }
            return Location.Unknown;
        }
    }
}