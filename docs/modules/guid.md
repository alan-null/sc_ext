---
layout: default
title: GUID Formats
parent: Modules
nav_order: 10
---

## Overview

The **GUID** command in the Launcher copies the current item ID in the format you need.

[![GUID formats demo](https://alan-null.github.io/blog/images/posts/sc-ext-5.0.0/guid.webp)](https://alan-null.github.io/blog/images/posts/sc-ext-5.0.0/guid.webp)

## Formats

| Format | Example |
| :--- | :--- |
| Braced upper | `{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}` |
| Braced lower | `{110d559f-dea5-42ea-9c1c-8a5df7e70ef9}` |
| Plain upper | `110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9` |
| Plain lower | `110d559f-dea5-42ea-9c1c-8a5df7e70ef9` |
| Search lowercase | `110d559fdea542ea9c1c8a5df7e70ef9` |
| Short ID | `110D559FDEA542EA9C1C8A5DF7E70EF9` |
| URL encoded | `%7B110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9%7D` |

Need a fresh one? **New random GUID** generates a new GUID and shows it in all formats.

## Launcher commands

**GUID Formats** provides this Launcher command:

| Name | Description |
| :--- | :--- |
| GUID | Copy the current item ID in a common GUID format (nested list of formats) |

{: .highlight }
The command is available in the Content Editor when an item is selected.

Read more about the [Launcher module]({{ site.baseurl }}{% link modules/launcher/index.md %}).
