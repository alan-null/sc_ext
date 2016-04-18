'use strict';
scExt.extensions = {};

scExt.extensions.sectionSwitches = (function () {
    var api = {};
    var sectionSwitchButtonClassName = 'scEButton'

    function closeOpenedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
    };

    function openClosedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
    };

    function createTabControlButton(text, callback) {
        var span = scExt.htmlHelpers.createElement('span', {});
        span.innerText = text
        var link = scExt.htmlHelpers.createElement('a', {
            href: '#',
            class: 'scEditorHeaderNavigator scEditorHeaderButton scButton ' + sectionSwitchButtonClassName
        });
        link.onclick = callback
        link.appendChild(span);
        return link;
    }

    function insertButtons() {
        var btnCollapse = createTabControlButton('Collapse', closeOpenedSections)
        var btnExpand = createTabControlButton('Expand', openClosedSections)

        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(btnCollapse, controlsTab.firstChild);
        controlsTab.insertBefore(btnExpand, controlsTab.firstChild);
    };

    function buttonsExists(params) {
        return document.getElementsByClassName(sectionSwitchButtonClassName).length > 0
    }

    function refreshButtons() {
        if (!buttonsExists()) {
            insertButtons();
        }
    }

    function addTreeNodeHandlers(className) {
        var nodes = document.getElementsByClassName(className);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', function (evt) {
                setTimeout(refreshButtons, 10);
            });
        }
    }

    api.init = function () {
        window.addEventListener('load', insertButtons);
        addTreeNodeHandlers('scContentTree');

        scExt.htmlHelpers.addProxy(scSitecore, 'postEvent', function () {
            setTimeout(refreshButtons, 10);
        })
    };
    return api;
})();

scExt.extensions.sectionSwitches.init();