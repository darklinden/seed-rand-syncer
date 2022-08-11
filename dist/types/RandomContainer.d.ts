import { SeedRandomInstance } from "./SeedRandomInstance";
export declare class RandomContainer {
    toJSON(): string;
    static fromJSON(json: string | any): RandomContainer;
    protected seedRandoms: Map<string, SeedRandomInstance>;
    setSeed(seedType: string, seed: string): void;
    restart(): void;
    randomNext(seedType: string): number;
    randomIndex(seedType: string, index: number): number;
    randomQueue(seedType: string, startIndex: number, endIndex: number): Array<number>;
}
