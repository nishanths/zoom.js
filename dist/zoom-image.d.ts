export declare class ZoomImage {
    readonly img: HTMLImageElement;
    private oldTransform;
    private wrapper;
    private overlay;
    private offset;
    private dismissCompleteNotified;
    private dismissCompleteCallbacks;
    private dismissModifiedDOM;
    constructor(img: HTMLImageElement, offset: number);
    private static makeOverlay;
    private static makeWrapper;
    private static elemOffset;
    private hackForceRepaint;
    private zoomModifyDOM;
    private dismissModifyDOM;
    private zoomAnimate;
    private dismissAnimate;
    zoom(): void;
    onDismissComplete(f: () => void): void;
    private notifyDismissComplete;
    dismiss(): void;
    dismissImmediate(): void;
}
