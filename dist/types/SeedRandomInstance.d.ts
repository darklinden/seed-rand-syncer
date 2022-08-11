import { SeedRandom } from "./SeedRandom";
export declare class SeedRandomInstance {
    seedTypeKey: string;
    startSeed: string;
    history: Array<[number, string]>;
    protected random: SeedRandom;
    constructor(seedTypeKey: string);
    resetSeed(seed: string): void;
    restart(): void;
    setSeed(seed: string): void;
    rand(): number;
    jsonObj(): any;
}
