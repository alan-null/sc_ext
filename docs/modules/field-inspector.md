---
layout: default
title: Field Inspector
parent: Modules
nav_order: 7
---

## Overview

How many times have you had to open an item template to check the exact name of the field you are looking at?

Inspect the real field name directly from the item, without navigating through the template structure. You can also navigate to the field item by clicking the `[Go to field]` button.

[![Field Inspector demo](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/fieldInspector.gif)](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/fieldInspector.gif)

## How it works

Field Inspector no longer depends on `DB Browser.aspx`, which recent Sitecore versions removed:

- **Field IDs** come from the field's editor control when it carries one, otherwise from the item's Reset Fields dialog page, which lists every field with its ID beside the same label the Content Editor shows.
- **Field names** come from the Sitecore Item Service (`/sitecore/api/ssc/item`, Sitecore 7.5 and later), using your Content Editor sign-in.
- **Reset Field** posts the Reset Fields dialog for the item's current language and version.

If the Item Service is switched off on an instance (`Sitecore.Services.SecurityPolicy` set to `ServicesOffPolicy`), the field name toggle shows a warning; Go to field and Reset Field keep working.
