# Architecture

Context document for anyone (human or agent) touching this codebase. Read this before adding a module or
touching anything that talks to Sitecore.

## The two worlds

Since Manifest V3 the extension runs in **two isolated JavaScript worlds** inside every Sitecore page:

| World       | Bundle                     | Runs at          | Can touch                                              |
| ----------- | -------------------------- | ---------------- | ------------------------------------------------------ |
| Isolated    | `sc_ext/Application.js`    | `document_end`   | DOM, `chrome.*` APIs, extension options                |
| Main (page) | `chrome/sitecoreBridge.js` | `document_start` | DOM, page globals (`Sitecore`, `scForm`, `scSitecore`) |

They share the DOM and nothing else. The isolated world **cannot** see `Sitecore` or `scForm`; the main world
**cannot** see `chrome.storage` or the options. Referencing `Sitecore` from isolated code throws
`ReferenceError: Sitecore is not defined`.


## Modules own both halves

A module is a folder under `app/sc_ext/modules/`. If it needs page globals it gets a second file in the
**same folder**, named `*.page.ts`, which is compiled into the main world bundle:

```
modules/placeholder/
    _all.ts                 references for the isolated bundle
    PlaceholderModule.ts    isolated: options, Location check, DOM, UI
    Placeholder.page.ts     main world: Sitecore.PageModes, LayoutDefinition
```

Gulp decides which bundle a file lands in purely by name:

* `app/sc_ext/**/*.page.ts` → `app/chrome/sitecoreBridge.js` (main world), task `typescript_page`
* every other `app/sc_ext/**/*.ts` → `app/sc_ext/Application.js` (isolated), task `typescript_sc_ext`

The two bundles are separate compilations: `*.page.ts` files cannot import isolated types and vice versa.
Cross-world types are plain JSON, nothing else.

## The bridge

[`app/sc_ext/page/PageBridge.page.ts`](../app/sc_ext/page/PageBridge.page.ts) is transport only and knows no
feature names. It offers three primitives to page-world code:

```ts
ScExtPage.register(name, handlers);       // expose an agent to the isolated world
ScExtPage.emit(name, payload);            // page -> isolated notification
ScExtPage.proxy(target, method, after);   // wrap a Sitecore function, run after it
```

and [`app/sc_ext/SitecorePageBridge.ts`](../app/sc_ext/SitecorePageBridge.ts) is the isolated-world end:

```ts
SitecorePageBridge.invoke('placeholder', 'initialize', [args]);   // isolated -> page call
SitecorePageBridge.on('page:changed', () => this.refresh());      // page -> isolated event
```

**Registration is the allowlist.** A `target`/`method` pair that nobody registered is unroutable, so there is
no separate list of permitted calls to keep in sync. Handlers must be own properties; inherited members such
as `constructor` or `toString` are rejected.

### Built-in agents and events

| Name                   | Kind   | Meaning                                                                                         |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `scForm`, `scSitecore` | agents | forward `invoke` / `postEvent` / `postRequest` / `resume` to the real page globals              |
| `page:changed`         | event  | Sitecore rerendered part of the page (`scForm.invoke`, `scForm.resume`, `scSitecore.postEvent`) |

Anything that decorates Content Editor DOM must re-run on `page:changed`; Sitecore replaces whole chunks of
markup on every request.

## Adding a module

1. Create `app/sc_ext/modules/<name>/` with `_all.ts` and `<Name>Module.ts`.
2. Extend `ModuleBase`, implement `ISitecoreExtensionsModule`:
   * `canExecute()` — options plus a `Context.Location()` check. It runs **outside** the manager's
     try/catch, so it must never throw and must never touch page globals.
   * `initialize()` — wire up DOM, events and bridge calls.
3. Reference the folder's `_all.ts` from [`app/sc_ext/_all.ts`](../app/sc_ext/_all.ts).
4. Construct and `addModule()` it in [`app/sc_ext/Application.ts`](../app/sc_ext/Application.ts), passing
   `wrapper.getModuleOptions('<Display Name>')`. The display name string is the options key — it must match
   the options page.
5. Add the module to the options page under `app/options/` if it has settings.
6. If it needs `Sitecore` or `scForm`, add the page half below.

## Adding a page-world half

```ts
/// <reference path='../../page/PageBridge.page.ts'/>

namespace ScExtPage.MyAgent {
    ScExtPage.register('myFeature', {
        initialize: function () {
            var sitecore = window['Sitecore'];
            if (!sitecore || !sitecore.PageModes) {
                return;                     // older Sitecore versions: degrade, never throw
            }
            ScExtPage.proxy(sitecore.PageModes.DesignManager, 'insertionStart', function () {
                ScExtPage.emit('myFeature:changed');
            });
        }
    });
}
```

The module then does:

```ts
initialize(): void {
    SitecorePageBridge.on('myFeature:changed', () => this.refresh());
    SitecorePageBridge.invoke('myFeature', 'initialize');
}
```

Rules that bite:

* **Everything crossing the boundary is structured-cloned.** No DOM nodes, no functions, no Sitecore objects.
  A callback cannot be passed; emit an event instead. `postEvent` arguments are nulled on the isolated side
  and re-filled with `document` on the page side for this reason.
* **Agents must be idempotent.** `initialize` can be called again; guard the proxies you install.
* **Messages are forgeable.** A hostile page can post a `sc_ext_page_call` or `sc_ext_page_event`, so a handler
  may only do things the page could already do to itself. Never route options, storage or `chrome.*` access
  through the bridge.
* **Never give a `*.page.ts` bundle output a name that collides with `app/chrome/*.ts`.** Both tasks write into
  `app/chrome/`, and `typescript_chrome` runs last.

## Checks

```bash
npm run build       # both bundles
npm run selfcheck   # asserts bridge routing against the built main world bundle
```

`scripts/pageBridge.selfcheck.js` loads `app/chrome/sitecoreBridge.js` in a `vm` sandbox and verifies routing,
own-property guarding, rejection of messages from other windows, event shape and proxy semantics. Run it after
any change to the bridge core.
