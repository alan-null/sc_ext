---
layout: default
title: Favorites
parent: Modules
nav_order: 6
---

## Overview

Every project has the same few items you jump to all the time: settings, a site root, a dictionary folder. Star them and open them from the Launcher.

Click the star in the Content Editor header, or run **Add to favorites** from the Launcher. Your favorites then show up in the Launcher, so the item you need is just `Ctrl + Space` and a few letters away.

[![Favorites demo](https://alan-null.github.io/blog/images/posts/sc-ext-5.0.0/favorites.webp)](https://alan-null.github.io/blog/images/posts/sc-ext-5.0.0/favorites.webp)

## Scope

Each favorite has a **scope** that decides where it is shown:

| Scope | Description |
| :--- | :--- |
| This instance | The favorite is shown only on the Sitecore instance where you saved it. |
| Any instance | The favorite is shown everywhere. |
| Matching hosts | The favorite is shown on hosts matching a wildcard pattern such as `*.cm`. |

{: .highlight }
Patterns match the whole hostname, ignoring case and port. A matching favorite opens on the host you are currently on, so one favorite works for local, test and production CM servers.

Change the scope of the current item with the **Change favorite scope** Launcher command, or edit it in the options page.

## Launcher commands

**Favorites** provides these Launcher commands:

| Name | Description |
| :--- | :--- |
| Favorites | Open a saved Content Editor item (nested list of your favorites) |
| Add to favorites | Save the current item |
| Remove from favorites | Remove the current item from favorites |
| Change favorite scope | Change where the current favorite is shown |
| Manage favorites | Open the Favorites options page |
| Clear favorites | Remove every saved favorite (press `Enter` again to confirm) |

Read more about the [Launcher module]({{ site.baseurl }}{% link modules/launcher/index.md %}).

## Options

Manage your favorites under **Options → Modules → Favorites**:

- search, rename and delete saved favorites,
- change the scope, hostname or hostname pattern of each favorite.

| Option | Description |
| :--- | :--- |
| Storage type | Keep favorites in Local Storage or Global Storage (default). |
| Use new favorites on | Default scope for new favorites: This instance (default) or Any instance. |
| Show favorites from other Sitecore instances | Show favorites saved on other instances. |
| Warn after this many favorites | Show a warning when the number of favorites exceeds this limit (default 50). |
| Show Content Editor ribbon tab | Add a Favorites tab to the Content Editor ribbon. |
| Show item header star | Show the star in the Content Editor item header. |

Favorites can be included when you export your settings, so moving to a new machine doesn't mean starting from scratch.
