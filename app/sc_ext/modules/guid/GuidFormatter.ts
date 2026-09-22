namespace SitecoreExtensions.Modules.Guid {
    export interface GuidFormat {
        key: string;
        title: string;
        value: string;
    }

    export class GuidFormatter {
        static format(value: string): GuidFormat[] {
            var plainUpper = value.replace(/[{}]/g, '').toUpperCase();
            var bracedUpper = '{' + plainUpper + '}';
            var plainLower = plainUpper.toLowerCase();

            return [
                { key: 'braced-upper', title: 'Braced upper', value: bracedUpper },
                { key: 'braced-lower', title: 'Braced lower', value: '{' + plainLower + '}' },
                { key: 'plain-upper', title: 'Plain upper', value: plainUpper },
                { key: 'plain-lower', title: 'Plain lower', value: plainLower },
                { key: 'search-lowercase', title: 'Search lowercase', value: plainLower.replace(/-/g, '') },
                { key: 'short-id', title: 'Short ID', value: plainUpper.replace(/-/g, '') },
                { key: 'url-encoded', title: 'URL encoded', value: encodeURIComponent(bracedUpper) }
            ];
        }
    }
}