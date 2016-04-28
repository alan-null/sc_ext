'use strict';
declare var scExt: any;
declare var scSitecore: any;

interface ISitecoreExtensionsModule {
    moduleName: string;
    description: string;

    canExecute(): boolean;
    initialize(): void;
}

class BaseModule {
    moduleName: string;
    description: string;
    constructor(name: string, description: string) {
        this.moduleName = name;
        this.description = description;
    }
}

class DatabaseNameModule extends BaseModule implements ISitecoreExtensionsModule {
    constructor(name: string, description: string) {
        super(name, description);
    }

    getDbName(): string {
        var element = <HTMLInputElement>document.querySelector('#__CurrentItem');
        return element.value.split('/').slice(2, 3)[0];
    }
    adDbNameToHeader(dbName: string): void {
        var dbnameDiv = scExt.htmlHelpers.createElement('div', { class: 'sc-globalHeader-loginInfo' })
        dbnameDiv.innerText = dbName;
        var startButton = document.querySelector('.sc-globalHeader-content .col2');
        startButton.insertBefore(dbnameDiv, startButton.firstChild);
    }

    canExecute(): boolean {
        return true;
    }

    initialize(): void {
        this.adDbNameToHeader(this.getDbName().toUpperCase());
    }
}

class SectionSwitchesModule extends BaseModule implements ISitecoreExtensionsModule {
    sectionSwitchButtonClassName: string;
    constructor(name: string, description: string) {
        super(name, description);
        this.sectionSwitchButtonClassName = 'scEButton';
    }

    closeOpenedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionExpanded .scEditorSectionCaptionGlyph', 'click');
    };

    openClosedSections() {
        scExt.htmlHelpers.triggerEventOnSelector('.scEditorSectionCaptionCollapsed .scEditorSectionCaptionGlyph', 'click');
    };

    createTabControlButton(text: string, callback: Function): HTMLAnchorElement {
        var span = scExt.htmlHelpers.createElement('span', {});
        span.innerText = text
        var link = scExt.htmlHelpers.createElement('a', {
            href: '#',
            class: 'scEditorHeaderNavigator scEditorHeaderButton scButton ' + this.sectionSwitchButtonClassName
        });
        link.onclick = callback
        link.appendChild(span);
        return link;
    }

    private insertButtons(): void {
        var btnCollapse = this.createTabControlButton('Collapse', this.closeOpenedSections)
        var btnExpand = this.createTabControlButton('Expand', this.openClosedSections)

        var controlsTab = document.querySelector('.scEditorTabControlsTab5');
        controlsTab.insertBefore(btnCollapse, controlsTab.firstChild);
        controlsTab.insertBefore(btnExpand, controlsTab.firstChild);
    };

    buttonsExists(): boolean {
        return document.getElementsByClassName(this.sectionSwitchButtonClassName).length > 0
    }

    refreshButtons(): void {
        if (!this.buttonsExists()) {
            this.insertButtons();
        }
    }

    addTreeNodeHandlers(className: string): void {
        var nodes = document.getElementsByClassName(className);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', function (evt) {
                setTimeout(() => {
                    this.refreshButtons();
                }, 10);
            });
        }
    }

    canExecute(): boolean {
        return true;
    }

    initialize(): void {
        window.addEventListener('load', () => this.insertButtons());
        this.addTreeNodeHandlers('scContentTree');
        scExt.htmlHelpers.addProxy(scSitecore, 'postEvent', () => setTimeout(this.refreshButtons, 10)
        )
    }
}


class SitecoreExtensions {
    modules: ISitecoreExtensionsModule[];
    constructor() {
        this.modules = new Array<ISitecoreExtensionsModule>();
    }

    addModule(module: ISitecoreExtensionsModule): void {
        this.modules.push(module);
    }

    initModules(): void {
        this.modules.forEach(m => {
            if (m.canExecute()) {
                m.initialize();
            }
        });
    }

    getModule(type: any): ISitecoreExtensionsModule {
        for (var index = 0; index < this.modules.length; index++) {
            var m = this.modules[index];
            if (m.constructor === type) {
                return m;
            }
        }
        return null;
    }
}

var sce = new SitecoreExtensions();
sce.addModule(new DatabaseNameModule('Database Name', 'Displays current database name in the Content Editor header'));
sce.addModule(new SectionSwitchesModule('Section Switches', 'Easily open/close all item sections with just one click'));
sce.initModules();