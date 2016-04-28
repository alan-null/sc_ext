'use strict';
declare var scExt: any;

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

    canExecute() {
        return true;
    }

    initialize() {
        this.adDbNameToHeader(this.getDbName().toUpperCase());
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
sce.initModules();