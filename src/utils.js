var windowWidth = () => document.documentElement.clientWidth;
var windowHeight = () => document.documentElement.clientHeight;

var elemOffset = elem => {
    var rect = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    var win = window;
    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};

var once = (elem, type, handler) => {
    var fn = e => {
        e.target.removeEventListener(type, fn);
        handler();
    };
    elem.addEventListener(type, fn);
};

export { windowWidth, windowHeight, elemOffset, once };
