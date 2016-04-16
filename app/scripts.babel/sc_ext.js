'use strict';
function closeOpenedSections() {
    var sections = document.querySelectorAll(".scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph")
    for (var index = 0; index < sections.length; index++) {
        sections[index].click();
    }
}

function createElement(tagName, attributes) {
    var element = document.createElement(tagName);
    for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            element.setAttribute(attr, attributes[attr]);
        }
    }
    return element;
}


if (typeof scContentEditor != "undefined") {
    var text = createElement('span', {});
    text.innerText = 'Collapse all sections'
    var linkNode = createElement('a', {
        'href': '#',
        'class': 'scEditorHeaderNavigator scEditorHeaderButton scButton'
    })
    linkNode.onclick = closeOpenedSections
    linkNode.appendChild(text);

    var insertCollapseAllButton = function () {
        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(linkNode, controlsTab.firstChild);
    }

    window.onload = insertCollapseAllButton;
    scContentEditor.prototype.onEditorClick = function () {
        setTimeout(function () {
            insertCollapseAllButton()
        }, 100);
    };
}