---
layout: default
title: Code Organization
parent: Contributing
nav_order: 2
permalink: /code-organization/
---

## Introduction

Source lives under `app` and is divided into four build areas. Generated JavaScript and CSS stay beside their source files during development and are copied into the release layout under `dist`.

## Projects

### chrome

Contains Chrome-specific extension code: the Manifest V3 service worker, content-script helpers, popup files, and images. The main-world bundle is also written to `app/chrome/sitecoreBridge.js`, but its TypeScript sources live with the Sitecore modules under `app/sc_ext`.

### common

Contains code shared by the extension areas, including the options provider and shared storage-related types. `typescript_common` produces `app/common/optionsProvider.js`.

### options

Maintains the options page and its settings models and providers. `typescript_options` compiles it to `app/options/app.js`.

### sc-ext

Main Sitecore Extensions project. `Application.ts` creates and registers modules, while `app/sc_ext/modules` contains each module's implementation, styles, and supporting files. `_all.ts` files provide TypeScript references for the concatenated build.

Most module code runs in the isolated extension world and is compiled into `app/sc_ext/Application.js`. A module that needs page globals such as `Sitecore`, `scForm`, or `scSitecore` keeps its page-world half in the same module folder using a `*.page.ts` filename. Those files are compiled into `app/chrome/sitecoreBridge.js`; see [Architecture]({{ site.baseurl }}{% link contributing/architecture.md %}) for the bridge rules.

## Runtime entry points

Manifest V3 loads two content-script entries on matching pages:

- `chrome/sitecoreBridge.js` runs at `document_start` in the page's **MAIN**
	world and can access Sitecore page globals.
- `chrome/contentscript.js`, `common/optionsProvider.js`, the library bundle,
	and `sc_ext/Application.js` run at `document_end` in the isolated extension
	world. They can access extension APIs and the DOM, but not page globals.

The worlds communicate through `SitecorePageBridge` and
`ScExtPage`; they do not share JavaScript objects.
