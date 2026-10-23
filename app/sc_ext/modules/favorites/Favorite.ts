namespace SitecoreExtensions.Modules.Favorites {
    export class Favorite {
        id: string;
        name: string;
        path: string;
        icon: string;
        database: string;
        language: string;
        host: string;
        scope?: 'instance' | 'any' | 'matching';
        hostPattern?: string;
        createdAt: number;

        public static key(favorite: Favorite): string {
            var scope = favorite.scope == 'any' || favorite.scope == 'matching' ? favorite.scope : 'instance';
            var host = scope == 'any' ? '' : scope == 'matching' ? favorite.hostPattern : favorite.host;
            return JSON.stringify([scope, (host || '').toLowerCase(), favorite.database, favorite.id.toLowerCase()]);
        }

        public static targetHost(favorite: Favorite, currentHost: string): string {
            return favorite.scope == 'any' || favorite.scope == 'matching' ? currentHost : favorite.host;
        }

        public static appliesTo(favorite: Favorite, host: string): boolean {
            if (favorite.scope == 'any') return true;
            if (favorite.scope != 'matching') return (favorite.host || '').toLowerCase() == host.toLowerCase();
            if (!favorite.hostPattern) return false;
            var pattern = favorite.hostPattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
            try {
                return new RegExp('^' + pattern + '$', 'i').test(new URL('http://' + host).hostname);
            } catch (_) { return false; }
        }

        public static validationError(favorite: Favorite): string {
            if (favorite.scope == 'any') return '';
            if (favorite.scope == 'matching') {
                return favorite.hostPattern && /^[a-z0-9_.*-]+$/i.test(favorite.hostPattern)
                    ? '' : 'Enter a hostname pattern, such as *.cm. Only * is a wildcard; omit the scheme, port and path.';
            }
            try {
                var host = favorite.host || '';
                if (host && !/[\s\/\\?#@*]/.test(host) && host.charAt(host.length - 1) != ':' && new URL('http://' + host).hostname) return '';
            } catch (_) { }
            return 'Enter a hostname with an optional port, such as author.local:8443. Omit the scheme and path.';
        }

        public static normalizeIcon(favorite: Favorite): string {
            if (!favorite.icon || !favorite.host) return favorite.icon;
            try {
                var icon = new URL(favorite.icon, 'https://' + favorite.host);
                if ((icon.protocol == 'https:' || icon.protocol == 'http:') && icon.host == favorite.host) {
                    return icon.pathname + icon.search + icon.hash;
                }
            } catch (_) { }
            return favorite.icon;
        }

        public static iconUrl(favorite: Favorite, currentHost: string, protocol: string): string {
            var icon = Favorite.normalizeIcon(favorite);
            return icon && icon.charAt(0) == '/' && icon.charAt(1) != '/'
                ? protocol + '//' + Favorite.targetHost(favorite, currentHost) + icon : icon;
        }
    }
}
