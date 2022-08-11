export declare class SeedRandom {
    private _genArc4;
    private _arc4g;
    private _prng;
    private _int32;
    private _quick;
    private _double;
    pool: number[];
    key: number[];
    private _seed;
    set seed(v: string);
    setSeed(v: string): void;
    get seed(): string;
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
    constructor(seed: string);
    static create(seed: string): SeedRandom;
}
