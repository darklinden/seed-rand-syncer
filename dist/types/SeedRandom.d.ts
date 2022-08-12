interface IRandScene {
    seed: string;
    key?: number[];
    pool?: number[];
}
export declare class SeedRandom {
    private _genArc4;
    private _arc4g;
    private _prng;
    private _int32;
    private _quick;
    private _double;
    seed: string;
    pool: number[];
    key: number[];
    setScene(seed: string, key: number[], pool: number[]): void;
    get scene(): IRandScene;
    private _flatten;
    private _mixkey;
    private _tostring;
    private arc4;
    random(): number;
    int32(): number;
    quick(): number;
    double(): number;
    range(from: number, to: number): number;
    rangeInt(from: number, to: number): number;
}
export {};
