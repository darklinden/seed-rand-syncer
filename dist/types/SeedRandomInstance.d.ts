import { SeedRandom } from "./SeedRandom";
import { ValueProcessor } from "./ValueProcessor";
export declare class SeedRandomInstance {
    seedTypeKey: string;
    history: Array<number>;
    protected _index: number;
    get index(): number;
    protected random: SeedRandom;
    constructor(seedTypeKey: string);
    protected normalizeSeed(seed: string): string;
    resetSeed(seed: string): void;
    get seed(): string;
    setIndex(index: number): void;
    rand(): number;
    private _valueProcessor;
    Value(): ValueProcessor;
    initFromJSON(json: string | any): void;
    static fromJSON(key: string, json: string | any): SeedRandomInstance;
    toJSON(): any;
}
