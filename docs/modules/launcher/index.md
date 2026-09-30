---
layout: default
title: Launcher
parent: Modules
nav_order: 5
has_children: true
permalink: /launcher/
---

## Overview

With **Launcher** you can easily navigate to various locations. Launcher is always available in Sitecore context.

Call the Launcher dialog with **`Ctrl + Space`**.

[![Launcher demo](https://alan-null.github.io/blog/images/posts/sc-ext-1.0.0/launcher1.gif)](https://alan-null.github.io/blog/images/posts/sc-ext-1.0.0/launcher1.gif)

You can feel the power of **Launcher** when using it in Content Editor. Forget about jumping from one tab to another. Use the intelligent *fuzzy* search engine and execute any command from the *Ribbon*.

[![Launcher in Content Editor](https://alan-null.github.io/blog/images/posts/sc-ext-1.0.0/launcher2.gif)](https://alan-null.github.io/blog/images/posts/sc-ext-1.0.0/launcher2.gif)

{: .highlight }
Each command defines whether it can be executed. On a particular page, you see only commands that can be successfully invoked.

## Modes

**Launcher** can work with two modes: command and search.

### Command mode

This is the default mode. You can invoke commands available in the current context.

{: .highlight }
By default, each navigation command opens in the current window. To open a command in a new tab, use `Ctrl + Enter` when executing it from Launcher.

### Search mode

Type `#` at the beginning to switch Launcher into instant search mode. With the hash at the beginning, you can search all Sitecore content. Like Sitecore instant search, it also accepts item IDs.

[![Instant Search](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/instantSearch.gif)](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/instantSearch.gif)

## Last used commands

Launcher exposes previously used commands immediately after it appears, which is useful when repeating a small set of commands.

[![Last used commands](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/lastUsedCommands.gif)](https://alan-null.github.io/blog/images/posts/sc-ext-3.0.0/lastUsedCommands.gif)

See the [available commands]({{ site.baseurl }}{% link modules/launcher/commands.md %}).
