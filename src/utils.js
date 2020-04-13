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

var backgroundImageDimensions = (elem) => {
    var imageSrc = elem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0]
    var image = new Image()
    image.src = imageSrc

    return {
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
    }
}

export { windowWidth, windowHeight, elemOffset, once, backgroundImageDimensions };
