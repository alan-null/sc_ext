'use strict';
scExt.extensions = {};

scExt.extensions.sectionSwitches = (function () {
    var api = {};

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
            class: 'scEditorHeaderNavigator scEditorHeaderButton scButton'
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

    function addTreeNodeHandlers(element) {
        addTreeNodeGlyphHandlers(element);
        var nodes = element.getElementsByClassName('scContentTreeNodeIcon');
        for (var i = 0; i < nodes.length; i++) {
            var parentNode = nodes[i].parentElement.parentElement;
            if (parentNode.attributes['sc-ext'] == undefined) {
                parentNode.setAttribute('sc-ext', 'init')
                parentNode.addEventListener('click', function (evt) {
                    setTimeout(function () {
                        insertButtons();
                    }, 10);
                });
            }
        }
    }

    function addTreeNodeGlyphHandlers(element) {
        var nodes = element.querySelectorAll('.scContentTreeNodeGlyph')
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', function (evt) {
                var parent = evt.srcElement.parentElement;
                var predicate = function () {
                    var children = parent.querySelectorAll('.scContentTreeNode > div .scContentTreeNode')
                    return children.length > 0;
                }
                scExt.htmlHelpers.observe(parent, 10, 10, predicate, function () {
                    addTreeNodeHandlers(parent);
                });
            });
        }
    }

    api.init = function () {
        window.addEventListener('load', insertButtons);
        addTreeNodeHandlers(document);
    };
    return api;
})();

scExt.extensions.sectionSwitches.init();