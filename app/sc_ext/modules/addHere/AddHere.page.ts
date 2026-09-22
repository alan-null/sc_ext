/// <reference path='../../page/PageBridge.page.ts'/>

// Main world half of the AddHere module: Sitecore redraws insertion handles without touching the DOM we decorate.
namespace ScExtPage.AddHereAgent {
    var watching = false;

    ScExtPage.register('addHere', {
        initialize: function () {
            var sitecore = window['Sitecore'];
            var designManager = sitecore && sitecore.PageModes && sitecore.PageModes.DesignManager;
            if (!designManager || watching) {
                return;
            }
            ScExtPage.proxy(designManager, 'insertionStart', function () {
                ScExtPage.emit('addHere:insertionStart');
            });
            watching = true;
        }
    });
}
