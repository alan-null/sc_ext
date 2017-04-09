declare interface MouseEvent {
    getSrcElement(): Element;
}

namespace SitecoreExtensions {
    MouseEvent.prototype['getSrcElement'] = function (): Element {
        return this.target;
    };
}