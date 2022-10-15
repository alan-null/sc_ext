[![Build status](https://alan-null.visualstudio.com/Sitecore%20Extensions/_apis/build/status/sc_ext)](https://alan-null.visualstudio.com/Sitecore%20Extensions/_build?definitionId=11)

# Sitecore Extensions

Sitecore Extensions is a google chrome/firefox extension which provides small improvements for Sitecore CMS.

## Supported Sitecore versions

- Sitecore.NET 8.0 and newer (full)
- Sitecore.NET 7.5 (partial)
- Sitecore.NET 7.2 (partial)
- Sitecore.NET 7.1 (partial)
- Sitecore.NET 7.0 (partial)

## Supported browsers

- [Chrome](https://chrome.google.com/webstore/detail/sitecore-extensions/aoclhcccfdkjddgpaaajldgljhllhgmd)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/dcbilinfbmohfdhjdekgpgpkcbhmfipl?hl=en-US)
- [Firefox](https://github.com/alan-null/sc_ext.firefox)
- [Opera](https://addons.opera.com/pl/extensions/details/sitecore-extensions-2/?display=en)
- [Vivaldi](https://chrome.google.com/webstore/detail/sitecore-extensions/aoclhcccfdkjddgpaaajldgljhllhgmd)

## Features

- Launcher - launch Sitecore commands using command omnibox,
- Collapse all sections - you can collapse all opened sections in Content Editor with just one click,
- Expand all sections - you can expand all opened sections in Content Editor with just one click,
- Database name - Displays current database name in the Content Editor header,
- Database colour - Change the global header colour depending on current database,
- Icon colour - changes colour to red when using Sitecore on current tab, otherwise will be grayed,
- Field Search - quickly find a field or section in the Content view in Content Editor,
- Restore Last Location - restores last opened item in Content Editor,
- Toggle Ribbon - small button which allows you to hide whole ribbon while working in Experience Editor,
- Tree Auto Expand - it will automatically expand tree structure if there is only one child under expanded item,
- Tree Scope - give an ability to scope a content tree to the currently selected item,
- Field Inspector - go to field, inspect field name, reset value to `__Standard values`,
- Add Here - extends AddHere button in ExperienceEditor with placeholder name

More information about all available feature with `gif` demos can be found [here](https://github.com/alan-null/sc_ext/wiki)

## Contributing

If you are interested in fixing issues and contributing directly to the code base, please see the document [How to Contribute](.github/CONTRIBUTING.md)

## Development

Follow steps below if you want to start coding.

### Prerequisites

Install **nodejs**

```cmd
https://nodejs.org/en/download/
```

### Environment setup

Clone repository

```cmd
git clone https://github.com/alan-null/sc_ext.git
```

Install node modules

```cmd
npm install
```

Build project

```cmd
npm run build
```

Run watch task if you want dynamic code rebuild in the background

```cmd
npm run watch
```

## Development - one click

If you are tired of downloading all those modules there is a quicker way.

Open **PowerShell Console** and run following code:

```powershell
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
choco install nodejs.install -y
choco install git.install -y
choco install visualstudiocode -y
choco install googlechrome -y

git clone https://github.com/alan-null/sc_ext.git
npm install
```

*If needed remove unnecessary choco packages.*

## License

[MIT](LICENSE)
[![Analytics](https://ga-beacon.appspot.com/UA-74179201-4/sc_ext?pixel)](https://github.com/igrigorik/ga-beacon)