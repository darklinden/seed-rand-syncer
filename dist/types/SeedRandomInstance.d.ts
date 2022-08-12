import { SeedRandom } from "./SeedRandom";
export declare class SeedRandomInstance {
    seedTypeKey: string;
    startSeed: string;
    history: Array<[number, string]>;
    protected _index: number;
    get index(): number;
    protected random: SeedRandom;
    constructor(seedTypeKey: string);
    resetSeed(seed: string): void;
    setIndex(index: number): void;
    setSeed(seed: string): void;
    rand(): number;
    jsonObj(): any;
}
