/// <reference path='../_all.ts'/>

namespace SitecoreExtensions.Options {
    export class OptionsRepository {
        options: OptionsWrapper;
        constructor(getOptionsCallback: any) {
            window.addEventListener('message', function (event) {
                if (event.data.sc_ext_enabled) {
                    if (event.data.sc_ext_options_response) {
                        var optionsWrapper = null;
                        if (event.data.payload) {
                            optionsWrapper = OptionsWrapper.create(event.data.payload);
                        } else {
                            optionsWrapper = new OptionsWrapper(null);
                        }
                        this.options = optionsWrapper;
                        getOptionsCallback(optionsWrapper);
                    }
                }
            });
        }

        loadOptions() {
            window.postMessage({
                sc_ext_enabled: true,
                sc_ext_options_request: true
            }, '*');
        }
    }
}

