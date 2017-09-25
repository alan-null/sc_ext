[![Build status](https://ci.appveyor.com/api/projects/status/4nag8qas7dk96nme/branch/master?svg=true)](https://ci.appveyor.com/project/alannull/sc-ext/branch/master)

# Sitecore Extensions

Sitecore Extensions is a google chrome/firefox extension which provides small improvements for Sitecore CMS.

## Supported versions:
- Sitecore.NET 8.2
- Sitecore.NET 8.1
- Sitecore.NET 8.0
- Sitecore.NET 7.5 (partial)
- Sitecore.NET 7.2 (partial)
- Sitecore.NET 7.1 (partial)
- Sitecore.NET 7.0 (partial)

## Downloads:

- [Chrome](https://chrome.google.com/webstore/detail/sitecore-extensions/aoclhcccfdkjddgpaaajldgljhllhgmd)
- [Vivaldi](https://chrome.google.com/webstore/detail/sitecore-extensions/aoclhcccfdkjddgpaaajldgljhllhgmd)
- [Firefox](https://github.com/alan-null/sc_ext.firefox)
- [Opera](https://addons.opera.com/pl/extensions/details/sitecore-extensions-2/?display=en)


## Features:
- Launcher - launch Sitecore commands using command omnibox,
- Collapse all sections - you can collapse all opened sections in Content Editor with just one click,
- Expand all sections - you can expand all opened sections in Content Editor with just one click,
- Database name - Displays current database name in the Content Editor header,
- Database colour - Change the global header colour depending on current database,
- Icon colour - changes colour to red when using Sitecore on current tab, otherwise will be grayed,
- Field Search - quickly find a field or section in the Content view in Content Editor,
- Restore Last Location - restores last opened item in Content Editor
- Toggle Ribbon - small button which allows you to hide whole ribbon while working in Experience Editor.
- Tree Auto Expand - it will automatically expand tree structure if there is only one child under expanded item.
- Tree Scope - give an ability to scope a content tree to the currently selected item
- Field Inspector - go to field, inspect field name, reset value to `__Standard values`

More information about all available feature with `gif` demos can be found [here](https://github.com/alan-null/sc_ext/wiki)

## Contributing
If you are interested in fixing issues and contributing directly to the code base, please see the document [How to Contribute](.github/CONTRIBUTING.md)

## Development
Follow steps below if you want to start coding.
#### Prerequisites
Install **nodejs**
```
https://nodejs.org/en/download/
```
Install **gulp**
```
npm install -g gulp
```

#### Environment setup
Clone repository
```
git clone https://github.com/alan-null/sc_ext.git
```
Install node modules
```
npm install
```
Build project
```
gulp build
```
Run watch task if you want dynamic code rebuild in the background
```
gulp watch
```


## License
[MIT](LICENSE)
[![Analytics](https://ga-beacon.appspot.com/UA-74179201-4/sc_ext?pixel)](https://github.com/igrigorik/ga-beacon)