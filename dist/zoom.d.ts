export type Config = {
    padding: number;
    paddingNarrow: number;
    dismissScrollDelta: number;
    dismissTouchDelta: number;
};
export declare const defaultConfig: Config;
export declare function zoom(img: HTMLImageElement, cfg?: Config): void;
export declare function dismissZoom(): void;
