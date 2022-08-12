import { SeedRandomInstance } from "./SeedRandomInstance";
export declare class RandomContainer {
    toJSON(): any;
    static fromJSON(json: string | any): RandomContainer;
    protected seedRandoms: Map<string, SeedRandomInstance>;
    setSeed(seedType: string, seed: string): void;
    setAllIndex(index: number): void;
    setIndex(seedType: string, index: number): void;
    randomNext(seedType: string): number;
    randomIndex(seedType: string, index: number): number;
    randomQueue(seedType: string, startIndex: number, endIndex: number): Array<number>;
}
