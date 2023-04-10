export declare class ZoomImage {
    readonly img: HTMLImageElement;
    private oldTransform;
    private wrapper;
    private overlay;
    private offset;
    constructor(img: HTMLImageElement, offset: number);
    private static makeOverlay;
    private static makeWrapper;
    private static elemOffset;
    private hackForceRepaint;
    private animate;
    zoom(): void;
    dismiss(): void;
}
