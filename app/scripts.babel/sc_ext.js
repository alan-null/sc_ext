'use strict';
scExt.extensions = {};

scExt.extensions.closeOpenedSections = function () {
    function clickSections(sections) {
        for (var i = 0; i < sections.length; i++) {
            sections[i].click();
        }
    }

    function closeOpenedSections() {
        var sections = document.querySelectorAll('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph')
        clickSections(sections);
    };

    function openClosedSections() {
        var sections = document.querySelectorAll('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph')
        clickSections(sections);
    };

    function insertCollapseAllButton() {
        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(lnkCollapse, controlsTab.firstChild);
    };

    function insertExpandAllButton() {
        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(lnkExpand, controlsTab.firstChild);
    };

    var text = scExt.htmlHelpers.createElement('span', {});
    text.innerText = 'Collapse all sections'
    var lnkCollapse = scExt.htmlHelpers.createElement('a', {
        href: '#',
        class: 'scEditorHeaderNavigator scEditorHeaderButton scButton'
    });
    lnkCollapse.onclick = closeOpenedSections
    lnkCollapse.appendChild(text);

    var lnkExpand = lnkCollapse.cloneNode(true);
    lnkExpand.firstChild.innerText = "Expand all sections"
    lnkExpand.onclick = openClosedSections;

    //add event handlers
    window.addEventListener("load", insertCollapseAllButton);
    window.addEventListener("load", insertExpandAllButton);
    var x = document.getElementsByClassName("scContentTreeNode");
    for (var i = 0; i < x.length; i++) {
        x[i].addEventListener('click', function (evt) {
            setTimeout(function () {
                insertCollapseAllButton();
                insertExpandAllButton();
                console.log(evt.srcElement);
            }, 10);
        });
    }
};

scExt.extensions.closeOpenedSections();