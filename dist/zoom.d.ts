export type Config = {
    padding: number;
    paddingNarrow: number;
    dismissScrollDelta: number;
    dismissTouchDelta: number;
};
export declare const defaultConfig: Config;
export declare function zoom(img: HTMLImageElement, cfg?: Config, onDismiss?: () => void): void;
export declare function dismissZoom(): void;
export declare function zoomed(): HTMLImageElement | null;
