'use strict';
scExt.extensions = {};

scExt.extensions.closeOpenedSections = function () {
    function closeOpenedSections() {
        var sections = document.querySelectorAll('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph')
        for (var i = 0; i < sections.length; i++) {
            sections[i].click();
        }
    };
    function insertCollapseAllButton() {
        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(linkNode, controlsTab.firstChild);
    };

    if (typeof scContentEditor != 'undefined') {
        var text = scExt.htmlHelpers.createElement('span', {});
        text.innerText = 'Collapse all sections'
        var linkNode = scExt.htmlHelpers.createElement('a', {
            href: '#',
            class: 'scEditorHeaderNavigator scEditorHeaderButton scButton'
        });
        linkNode.onclick = closeOpenedSections
        linkNode.appendChild(text);

        window.onload = scContentEditor.prototype.onEditorClick = function () {
            setTimeout(function () {
                insertCollapseAllButton()
            }, 100);
        };
    }
};

scExt.extensions.closeOpenedSections();