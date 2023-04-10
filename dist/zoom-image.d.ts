export declare class ZoomImage {
    private img;
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
    dismiss(onDone?: () => void): void;
}
