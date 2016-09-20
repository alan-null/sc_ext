[![Build status](https://ci.appveyor.com/api/projects/status/4nag8qas7dk96nme/branch/master?svg=true)](https://ci.appveyor.com/project/alannull/sc-ext/branch/master)

# Sitecore Extensions
 
Sitecore Extensions is a google chrome extension which provides small improvements for Sitecore CMS. 

## Supported versions:
- Sitecore.NET 8.2 
- Sitecore.NET 8.1 
- Sitecore.NET 8.0 
- Sitecore.NET 7.5 (partial) 
- Sitecore.NET 7.2 (partial) 
- Sitecore.NET 7.1 (partial)
- Sitecore.NET 7.0 (partial)

## Features:
- Launcher - launch Sitecore commands using command omnibox,
- Collapse all sections - you can collapse all opened sections in Content Editor with just one click,
- Expand all sections - you can expand all opened sections in Content Editor with just one click,
- Database name - Displays current database name in the Content Editor header,
- Database colour - Change the global header colour depeding on current database,
- Icon colour - changes colour to red when using Sitecore on current tab, otherwise will be grayed

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