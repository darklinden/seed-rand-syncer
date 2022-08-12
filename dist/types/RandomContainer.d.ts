import { SeedRandomInstance } from "./SeedRandomInstance";
import { ValueProcessor } from "./ValueProcessor";
export declare class RandomContainer {
    toJSON(): any;
    static fromJSON(json: string | any): RandomContainer;
    initWithJSON(json: string | any): void;
    protected seedRandoms: Map<string, SeedRandomInstance>;
    setSeed(seedType: string, seed: string): void;
    allkeys(): Array<string>;
    getSeed(seedType: string): string;
    setAllIndex(index: number): void;
    setIndex(seedType: string, index: number): void;
    Value(seedType: string): ValueProcessor;
    randomNext(seedType: string): number;
    randomIndex(seedType: string, index: number): number;
    randomQueue(seedType: string, startIndex: number, endIndex: number): Array<number>;
}
