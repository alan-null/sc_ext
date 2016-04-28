'use strict';
declare var scExt: any;

// scExt.extensions = {};

// scExt.extensions.sectionSwitches = (function () {
//     var api = {};
//     var sectionSwitchButtonClassName = 'scEButton'

//     function closeOpenedSections() {
//         scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
//     };

//     function openClosedSections() {
//         scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
//     };

//     function createTabControlButton(text, callback) {
//         var span = scExt.htmlHelpers.createElement('span', {});
//         span.innerText = text
//         var link = scExt.htmlHelpers.createElement('a', {
//             href: '#',
//             class: 'scEditorHeaderNavigator scEditorHeaderButton scButton ' + sectionSwitchButtonClassName
//         });
//         link.onclick = callback
//         link.appendChild(span);
//         return link;
//     }

//     function insertButtons() {
//         var btnCollapse = createTabControlButton('Collapse', closeOpenedSections)
//         var btnExpand = createTabControlButton('Expand', openClosedSections)

//         var controlsTab = document.querySelector('.scEditorTabControlsTab5');
//         controlsTab.insertBefore(btnCollapse, controlsTab.firstChild);
//         controlsTab.insertBefore(btnExpand, controlsTab.firstChild);
//     };

//     function buttonsExists(params) {
//         return document.getElementsByClassName(sectionSwitchButtonClassName).length > 0
//     }

//     function refreshButtons() {
//         if (!buttonsExists()) {
//             insertButtons();
//         }
//     }

//     function addTreeNodeHandlers(className) {
//         console.log('Add tre nodes handlers');
//         var nodes = document.getElementsByClassName(className);
//         for (var i = 0; i < nodes.length; i++) {
//             nodes[i].addEventListener('click', function (evt) {
//                 setTimeout(refreshButtons, 10);
//             });
//         }
//     }

//     api.init = function () {
//         window.addEventListener('load', insertButtons);
//         addTreeNodeHandlers('scContentTree');

//         scExt.htmlHelpers.addProxy(scSitecore, 'postEvent', function () {
//             setTimeout(refreshButtons, 10);
//         })
//     };
//     return api;
// })();

// scExt.extensions.dbName = (function () {
//     var api = {};

//     function getDbName() {
//         return document.querySelector('#__CurrentItem').value.split('/').slice(2, 3)[0];
//     }

//     function adDbNameToHeader(dbName) {
//         var dbnameDiv = scExt.htmlHelpers.createElement('div', { class: 'sc-globalHeader-loginInfo' })
//         dbnameDiv.innerText = dbName;
//         var startButton = document.querySelector('.sc-globalHeader-content .col2');
//         startButton.insertBefore(dbnameDiv, startButton.firstChild);
//     }

//     api.init = function () {
//         adDbNameToHeader(getDbName().toUpperCase());
//     };
//     return api;
// })();

// scExt.extensions.launcher = (function () {
//     var api = {};
//     var fuse;
//     var modalElement,
//         searchResultsElement,
//         searchBoxElement,
//         selectedCommand;

//     var launcherOptions = {
//         searchResultsCount: 5,
//         shortcuts: {
//             show: 32,
//             hide: 27,
//             selectNextResult: 40,
//             selectPrevResult: 38,
//             executeCommand: 13
//         }
//     };

//     var fuseDatasource = {
//         commands: (function () {
//             return [
//                 {
//                     id: '1',
//                     name: 'Close sections',
//                     description: 'Close all opened sections',
//                     command: {
//                         callback: function () {
//                             scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
//                         },
//                         shortcut: ''
//                     }
//                 },
//                 {
//                     id: '2',
//                     name: 'Open sections',
//                     description: 'Open all closed sections',
//                     command: {
//                         callback: function () {
//                             scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
//                         },
//                         shortcut: ''
//                     }
//                 }
//             ];
//         })(),
//         options: (function () {
//             return {
//                 caseSensitive: false,
//                 includeScore: false,
//                 shouldSort: true,
//                 tokenize: false,
//                 threshold: 0.6,
//                 location: 0,
//                 distance: 100,
//                 maxPatternLength: 32,
//                 keys: ['name'],
//                 // verbose: true
//             };
//         })()
//     }

//     var launcherControl = {
//         show: function () {
//             modalElement.style.display = 'block';
//             searchBoxElement.focus();
//         },
//         hide: function () {
//             modalElement.style.display = 'none';
//             searchBoxElement.value = '';
//             searchResults.clearResults();
//         }
//     }

//     var searchResults = {
//         appendResults: function (sortedResults) {
//             searchResults.clearResults();
//             if (sortedResults.length > 0) {
//                 for (var i = 0; i < sortedResults.length && i < launcherOptions.searchResultsCount; i++) {
//                     var li = buildCommandHtml(sortedResults[i]);
//                     searchResultsElement.appendChild(li);
//                 }

//                 if (searchResultsElement.className !== 'term-list') {
//                     searchResultsElement.className = 'term-list';
//                 }
//             }
//         },
//         clearResults: function () {
//             searchResultsElement.className = 'term-list hidden';
//             searchResultsElement.innerHTML = '';
//         }
//     }

//     function buildCommandHtml(command) {
//         var li = scExt.htmlHelpers.createElement('li', { id: command.id });

//         var spanName = scExt.htmlHelpers.createElement('span', { class: 'command-name' });
//         spanName.innerText = command.name;
//         var spanDescription = scExt.htmlHelpers.createElement('span', { class: 'command-description' });
//         spanDescription.innerText = command.description;

//         li.appendChild(spanName);
//         // li.appendChild(spanDescription);

//         return li;
//     }

//     function injectlauncherHtml() {
//         var modal = scExt.htmlHelpers.createElement('div', { class: 'modal', id: 'myModal' });
//         var div = scExt.htmlHelpers.createElement('div', { class: 'modal-content' });
//         var input = scExt.htmlHelpers.createElement('input', { class: 'search-field', id: 'scESearchBox' })

//         var ul = scExt.htmlHelpers.createElement('ul', { class: 'term-list hidden', id: 'searchResults' })
//         input.onkeyup = inputKeyUpEvent;
//         div.appendChild(input);
//         div.appendChild(ul);
//         window.onclick = windowClickEvent;
//         modal.appendChild(div);
//         document.getElementById('Body').appendChild(modal);
//     }

//     function registerGlobalShortcuts() {
//         document.onkeydown = function (e) {
//             e = e || window.event;
//             switch (e.which || e.keyCode) {
//                 case launcherOptions.shortcuts.show: {
//                     if (e.ctrlKey) {
//                         launcherControl.show();
//                     }
//                     break;
//                 }
//                 case launcherOptions.shortcuts.hide: {
//                     if (event.target == searchBoxElement) {
//                         launcherControl.hide();
//                     }
//                     break;
//                 }
//                 default: return;
//             }
//             e.preventDefault();
//         };
//     }

//     function inputKeyUpEvent(evt) {
//         if (evt.keyCode == launcherOptions.shortcuts.executeCommand && selectedCommand[0]) {
//             var command = fuseDatasource.commands.find(function (e) {
//                 return e.id == selectedCommand[0].id
//             });
//             console.log(command);
//             command.command.callback();
//             launcherControl.hide();
//             return;
//         }
//         if (evt.keyCode == launcherOptions.shortcuts.selectPrevResult || evt.keyCode == launcherOptions.shortcuts.selectNextResult) {
//             commandSelectionEvent(evt);
//         } else {
//             var results = search(searchBoxElement.value);
//             searchResults.appendResults(results);

//             if (searchResultsElement.children.length > 0) {
//                 searchResultsElement.firstChild.setAttribute('class', 'selected');
//             }
//         }
//     }

//     function windowClickEvent(event) {
//         if (event.target == modalElement) {
//             modalElement.style.display = 'none';
//             searchBoxElement.value = ''
//         }
//     }

//     function commandSelectionEvent(evt) {
//         var commands = searchResultsElement.querySelectorAll('li')
//         if (commands.length > 0) {
//             var selected = searchResultsElement.querySelector('.selected')
//             if (selected == undefined) selected = searchResultsElement.querySelector('li')

//             if (evt.keyCode == launcherOptions.shortcuts.selectPrevResult && commands[0] != selected) {
//                 if (selected.className == 'selected') {
//                     selected.removeAttribute('class')
//                     selected.previousSibling.setAttribute('class', 'selected');
//                 } else {
//                     selected.setAttribute('class', 'selected');
//                 }
//             }

//             if (evt.keyCode == launcherOptions.shortcuts.selectNextResult && commands.length != 0) {
//                 if (selected.className == 'selected' && commands[commands.length - 1] !== selected) {
//                     selected.removeAttribute('class')
//                     selected.nextSibling.setAttribute('class', 'selected');
//                 } else {
//                     selected.setAttribute('class', 'selected');
//                 }
//             }
//         }
//     }

//     function search(phrase) {
//         if (fuse == undefined) {
//             fuse = new scExt.libraries.Fuse(fuseDatasource.commands, fuseDatasource.options);
//         }
//         return fuse.search(phrase);
//     }

//     api.init = function () {
//         injectlauncherHtml();
//         registerGlobalShortcuts();
//         modalElement = document.getElementById('myModal');
//         searchBoxElement = document.getElementById('scESearchBox')
//         searchResultsElement = document.getElementById('searchResults')
//         selectedCommand = document.getElementsByClassName('selected')
//     };
//     return api;
// })();

// scExt.extensions.sectionSwitches.init();
// scExt.extensions.dbName.init();
// scExt.extensions.launcher.init();
