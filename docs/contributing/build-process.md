---
layout: default
title: Build Process
parent: Contributing
nav_order: 3
permalink: /build-process/
---

## Introduction

This document explains how the build process works.

## Build commands

### Main commands

#### build

`npm run build` runs the build once. It cleans previous generated output, compiles TypeScript, compiles Sass, copies library assets and static files, copies the manifest, publishes optimized files to `dist`, and reports package size.

#### package

`npm run package` runs `build` and creates `package/sc-ext-<manifest.version>.zip` from `dist`.

#### watch

`npm run watch` starts a watcher that rebuilds output files when source files change. It sets build mode to `watch`, so TypeScript and Sass errors are reported without stopping the watcher.

The watcher covers TypeScript in `app/sc_ext`, `app/chrome`, `app/options`, and `app/common`, plus Sass under `app/sc_ext/styles` and `app/chrome/popup`.

## Build blocks

### set_mode

`set_mode` sets the global variable **mode** to `watch`.

Depending on that value, build error handling varies:

- `build`: if an error occurs during build, the main task is interrupted and the process exits with status code **1**.
- `watch`: if an error occurs during build, the task continues.

### cleanup_dev

`cleanup_dev` removes generated JavaScript and source maps from the development
output directories before TypeScript compilation.

### typescript_all

`typescript_all` runs `cleanup_dev` and invokes all TypeScript tasks in order:

- `typescript_sc_ext`
- `typescript_page`
- `typescript_chrome`
- `typescript_options`
- `typescript_common`

Learn more about micro projects in [Code Organization]({{ site.baseurl }}{% link contributing/code-organization.md %}).

TSLint processing is part of each TypeScript task. After the task runs, style errors and warnings are reported. Learn more about code style in [Coding Guidelines]({{ site.baseurl }}{% link contributing/coding-guidelines.md %}).

`typescript_sc_ext` creates `app/sc_ext/Application.js` and excludes `*.page.ts`.
`typescript_page` creates `app/chrome/sitecoreBridge.js` from the bridge and
module page-world files. `typescript_chrome` compiles Chrome-specific sources,
`typescript_options` creates `app/options/app.js`, and `typescript_common`
creates `app/common/optionsProvider.js`.

### publish_all

`publish_all` invokes all publish tasks:

- `publish_sc_ext`
- `publish_chrome`
- `publish_options`
- `publish_options_libs`
- `publish_common`
- `publish_popup`

Publish tasks minify JavaScript, CSS, and HTML where applicable, then write the
release layout under `dist`. `publish_chrome` excludes the development-only
`chromereload.js` file.

### sass_all

`sass_all` invokes both Sass tasks:

- `sass_sc_ext` compiles styles under `app/sc_ext`.
- `sass_popup` compiles styles under `app/chrome/popup`.

### chromeManifest

`chromeManifest` copies `app/manifest.json` to `dist/manifest.json`. The
manifest is not rewritten during this task.

### extras

`extras` copies root-level files from `app` and `app/_locales` to `dist`, while
leaving JSON files for dedicated tasks such as `chromeManifest`.

### copy_lib

`copy_lib` copies the `izitoast` JavaScript and CSS assets into
`app/sc_ext/libraries`.

### selfcheck

`npm run selfcheck` runs every `scripts/*.selfcheck.js` file. Run it after a
build; the page bridge check loads the generated
`app/chrome/sitecoreBridge.js` bundle and verifies bridge routing and proxy
behavior.
