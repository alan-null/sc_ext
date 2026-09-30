---
layout: default
title: Commands
parent: Launcher
nav_order: 1
permalink: /commands/
---

<a id="commands"></a>
## Available commands

- [AdminShortcuts](#adminshortcuts)
- [ContentEditorRibbon](#contenteditorribbon)
- [ContentEditor](#contenteditor)
- [LaunchPadCommandsProvider](#launchpadcommandsprovider)
- [SitecoreApplicationsCommandsProvider](#sitecoreapplicationscommandsprovider)
- [ShellCommandsProvider](#shellcommandsprovider)

### AdminShortcuts

| Name | Description |
| :--- | :--- |
| Administration Tools.aspx | List of all administrative tools |
| Cache.aspx | Caches overview. |
| Config Layers.aspx | Merge configuration files depending on configuration layers and roles |
| DB Browser.aspx | Interface for various item manipulations. |
| DB Browser.aspx?id=CurrentItem | Opens DB Browser.aspx and navigates to current item |
| Database Cleanup.aspx | Perform various cleanup operations on specific databases. |
| Dependency Injection Configuration.aspx | Shows configured services. For detailed information use `details=1`. |
| EventQueue Statistics.aspx | Overview of EventQueue processing. |
| Fill DB - Sitecore Item Generator.aspx | Fill a specific database with dummy items. |
| Install a language.aspx | Install a new language for your content in Sitecore. |
| Jobs Viewer.aspx | Overview of jobs execution. |
| Ling Scratch Pad.aspx | Execute custom search code. |
| Logs.aspx | Choose log file type to open |
| Media Hash Generator.aspx | Lets you generate hashes for dynamic image scaling URLs |
| Package Item.aspx | Package a specific item with its dependencies. |
| Path Analyzer Utilities.aspx | Configure the Path Analyzer |
| Pipeline Profiler.aspx | Pipeline execution timings. |
| PublishQueue statistics.aspx | Overview of PublishQueue processing. |
| Raw Search.aspx | Search for a specific string in the database or file system. |
| Rebuild Key Behavior Cache.aspx | Rebuild the Key Behavior Cache |
| Rebuild Reporting Database.aspx | Rebuild the Reporting Database |
| Redeploy Marketing Data.aspx | Redeploy segments and maps for the Path Analyzer and Experience Analytics |
| Remove Broken Links.aspx | Remove broken links from a specific database. |
| Rendering statistics.aspx | Overview of rendering performance |
| Restore Item.aspx | Restore items from archive. |
| Security Tools.aspx | Various login and user management features. |
| Serialization.aspx | Serialize and revert databases |
| Set Application Center Endpoint.aspx | Change Application Center endpoint address |
| Show Config.aspx | Merge configuration files. |
| Sitecore Support Package Generator.aspx | Send a support package to Sitecore Support to reduce diagnosis and resolution time. |
| Sql Shell.aspx | Execute SQL scripts using specific connection strings. |
| Unlock Admin.aspx | Unlock the Admin user. |
| Update Installation Wizard.aspx | Install Sitecore updates. |
| User Info.aspx | Logged-in user details. |

[Back to top](#commands)

### ContentEditorRibbon

| Name | Description |
| :--- | :--- |
| **Home** | |
| Save | Save changes. (Ctrl+S) |
| Edit | Lock or unlock the item for editing. (F8) |
| Insert from template | Insert from template |
| Duplicate item | Duplicate item |
| Clone item | Clone item |
| Copy to | Copy the item to another location. |
| Move to | Move the item to another location. |
| Delete | Delete the item. |
| Delete children | Delete current item subitems. |
| Rename | Rename the item key. (F2) |
| Display name | Change the language-specific name. |
| Move Up | Move the item one step up in the Content Tree. (Ctrl+Shift+Alt+Up) |
| Move Down | Move the item one step down in the Content Tree. (Ctrl+Shift+Alt+Down) |
| Move First | Move the item to the first place at this level in the Content Tree. |
| Move Last | Move the item to the last place at this level in the Content Tree. |
| **Navigate** | |
| Open | Open an item. |
| Navigate: Back | Go to the previously selected item. |
| Navigate: Forward | Go to the next selected item. |
| Navigate: Up | Go to the parent item. |
| Navigate: Home | Go to your home item. (Ctrl+Shift+Home) |
| Add to favorites | Add current item to favorites |
| Organize | Organize favorites |
| Search | Open the Search application. (Ctrl+Shift+F) |
| **Review** | |
| Spellcheck | Run spellcheck on all text and HTML fields in the selected item. |
| Validate Markup | Send all HTML fields to the W3C HTML Validator. |
| Validation | View validation results. (F7) |
| My items | View items you have locked. |
| Set reminder | Set reminder |
| Clear reminder | Clear reminder |
| Archive item now | Archive item now |
| Archive version now | Archive version now |
| Set archive date | Set archive date |
| **Analyze** | |
| Goals | Associate goals with the selected item. |
| Attributes | Associate attributes with the selected item. |
| Tracking Details | View attributes assigned to the selected item. |
| Page Analyzer | Page Analyzer |
| Reports | Run an item report on the selected item. |
| **Publish** | |
| Change Publishing Settings | Set up publishing settings. |
| Publish Now | Publish the item in all languages to all publishing targets. |
| Publish Item | Publish item |
| Publish Site | Publish site |
| Experience Editor | Start the Experience Editor. |
| Preview | Start Preview mode. |
| Publishing viewer | View publishing dates for each version. |
| Messages | Create, edit, and post a message on a target network. |
| **Versions** | |
| Reset Fields | Reset field values. |
| Add Version | Add a version of the selected item. |
| Compare Versions | Compare versions of the selected item. |
| Remove Version | Remove the currently displayed item version. |
| Remove all versions | Remove all versions |
| Translate | Show translate mode. |
| **Configure** | |
| Help | Write help texts. |
| Editors | Configure custom editors. |
| Tree node style | Define the appearance in the content tree. |
| Contextual tab | Specify a contextual tab in the ribbon. |
| Context menu | Specify the context menu. |
| Bucket | Convert this item into an item bucket. (Ctrl+Shift+B) |
| Revert | Revert this item bucket to a normal folder. (Ctrl+Shift+D) |
| Sync | Synchronize this item bucket. (Ctrl+Shift+U) |
| Bucketable: Current item | Allow the current item to be stored as an unstructured item in an item bucket. |
| Bucketable: Standard values | Allow all items based on the Sample Item to be stored as unstructured items in a bucket. |
| Set Masters | Assign insert options |
| Reset | Reset to insert options defined on the template. |
| Change Template | Change to another template. |
| Edit Template | Open the Template Editor. |
| Hide Item | Mark the item as hidden or visible. |
| Protect Item | Protect or unprotect the item from changes. (Ctrl+Shift+Alt+L) |
| **Presentation** | |
| Layout Details | View and edit layout details for the selected item. |
| Reset Layout | Reset layout details to settings defined at template level. |
| Preview | Preview the selected item presentation. |
| Screenshots | Take screenshots of webpages. |
| Aliases | Assign URL aliases. |
| Set Feed Presentation | Set up the RSS feed presentation. |
| **Security** | |
| Remove Inherit | Security Preset: Remove Inherit |
| Require Login | Security Preset: Require Login |
| Assign | Assign security rights for the selected item. |
| Security Details | View assigned security rights for the selected item. |
| Change | Change ownership. |
| Access Viewer | Open the Access Viewer. |
| User Manager | Open the User Manager. |
| **View** | |
| Content tree | Show or hide the content tree. |
| Entire tree | Show or hide all sections in the content tree. |
| Hidden items | Show or hide items marked with the Hidden attribute. |
| Standard fields | Show or hide fields from the Standard Template. (Ctrl+Shift+Alt+T) |
| Raw values | Show field values as input boxes or raw values. (Ctrl+Shift+Alt+R) |
| Buckets | Show or hide bucket repository items |
| **My Toolbar** | |
| Customize | Customize My Toolbar |
| **Developer** | |
| Create Template | Create new template |
| Go to Master | Go to the first branch |
| Go to Template | Go to the template |
| Serialize item | Serialize the item to the file system |
| Serialize tree | Serialize the item and subitems to the file system |
| Update item | Update the item from the file system |
| Revert item | Revert the item from the file system |
| Update tree | Update the item and subitems from the file system |
| Revert tree | Revert the item and subitems from the file system |
| Update database | Update the database from the file system. Does not remove local modifications. |
| Revert database | Revert the database from the file system |
| Rebuild all | Rebuild all indexes. |
| Re-Index Tree | Rebuild the index for this item and its descendants. |

[Back to top](#commands)

### ContentEditor

| Name | Description |
| :--- | :--- |
| Unclone | Unclone current item and all children |
| Unclone item | Unclone a single item |
| New folder | Create a new Common/Folder |
| Assign Security Rights | Edit permissions for the selected item |
| Remove language | Remove every version of the item in the current language. |
| Select icon | Select a new icon for the selected item |
| Select language | Select the language |
| Custom Editors | Select custom editors for the current item. |
| Set Initial Workflow | Select the workflow |
| Reset default workflow | Set the initial workflow to none |
| Change ownership (set owner) | Change the owner of the item. |
| Sort order of subitems (subitems sorting) | Select criteria for sorting subitems |
| Transfer item to database | Move an item to another database |
| Upload Files | Upload files to a media library |
| Reset Masters (insert options) | Reset insert options to those defined in the template |
| New media folder | Create a new Media/Media folder |
| Download media | Download attached media file |
| View media | View attached media file |
| Deep link | Store the URL to the current item in the clipboard |

[Back to top](#commands)

### LaunchPadCommandsProvider

| Name | Description |
| :--- | :--- |
| Experience Analytics | View dashboards and reports that provide an overview of experience data patterns and trends |
| Experience Profile | Complete insight into customer experiences |
| Federated Experience Manager | Track visitor interactions and generate analytics information on external websites with Sitecore |
| Experience Optimization | Performance reports |
| List Manager | Manage Sitecore contacts in lists and create campaign recipient lists |
| Campaign Creator | Create campaign activities and classify them with taxonomy |
| Path Analyzer | Create a map showing sequential paths contacts take as they navigate your website |
| Marketing Control Panel | Configure marketing features |
| Content Editor | Manage and edit website content |
| Experience Editor | Make changes to items directly on the page |
| Media Library | Manage media items such as images, documents, videos, and audio |
| Workbox | Display information about workflow items, editing history, and workflow state counts |
| Recycle Bin | Restore deleted items or remove them from Sitecore |
| Control Panel | Manage your Sitecore instance |
| App Center | Extend the Sitecore Experience Platform with preintegrated experience management apps |
| Desktop | Default start location |
| Access Viewer | Get an overview of access rights assigned to each account for each item |
| Domain Manager | Create and manage domains |
| Role Manager | Create and manage roles for users |
| Security Editor | Manage access rights for roles and users |
| User Manager | Create and manage users with access to Sitecore |
| Xpath Builder | Test Sitecore queries |

[Back to top](#commands)

### SitecoreApplicationsCommandsProvider

| Name | Description |
| :--- | :--- |
| License Details | About License Details |
| Access Viewer | Get an overview of access rights assigned to each account for each item |
| Archive | See archived items |
| Content Editor | Manage website content. |
| Developer Center | Create new functionality. |
| Domain Manager | Create and manage domains |
| File Explorer | Browse web application files. |
| Image Editor | Edit images |
| Install Package | Package design tool |
| Keyboard Map | Assign keyboard shortcuts to Sitecore actions such as Save or Open. |
| Licenses | Information about installed licenses. |
| Log Viewer | View application logs |
| Marketing Control Panel | Configure marketing features. |
| Media Library | Maintain media items. |
| Package Designer | Package design tool |
| Recycle Bin | Restore deleted items or remove them from Sitecore completely. |
| Role Manager | Create and manage roles for users |
| Run | Enter the name of an application, folder, document, or internet resource to open. |
| Scan for Broken Links | Scan for broken links |
| Search | Sitecore search application |
| Security Editor | Manage access rights for roles and users |
| Template Manager | Create new templates. |
| User manager | Create and manage users with access to Sitecore |
| Workbox | Display information about workflow items, editing history, and workflow state counts |

[Back to top](#commands)

### ShellCommandsProvider

| Name | Description |
| :--- | :--- |
| Analytics - Reports | Experience Analytics reports |
| Analytics - Status Information | Overview of server status |
| Export Languages | Select languages to export |
| Import Languages | Enter the language file name to import |
| Scan for Untranslated Fields | Select languages to scan for untranslated fields |
| Change Region and Language Options | Select preferred number/date format and application language |
| Change personal/user Information | Change personal or user information |
| Change wallpaper | Select a desktop background. |
| Content Carousel | Present content items as a carousel |
| Customize My Toolbar | Add or remove commands from My Toolbar. |
| User Options | Application Options |
| Add a new language | Choose a predefined language code or enter a language and region code |
| Delete a Language | Select languages to delete |
| Database Usage | Database usage statistics |
| Rebuild Link Databases | Rebuild link databases |
| License Details | Show the license details window |
| Licenses | Show installed licenses |
| Indexing Manager (rebuild search index) | Select search indexes to rebuild |
| Generate the Solr schema | Generate the Solr Schema.xml file |
| Deploy marketing definitions | Deploy marketing definitions |

[Back to top](#commands)
