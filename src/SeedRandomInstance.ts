import { SeedRandom } from "./SeedRandom";

export class SeedRandomInstance {

    public seedTypeKey: string;
    public startSeed: string;
    public history: Array<[number, string]>;

    protected _index: number = 0;
    public get index(): number { return this._index; }

    protected random: SeedRandom;

    constructor(seedTypeKey: string) {
        this.seedTypeKey = seedTypeKey
        this.random = new SeedRandom(null);
        this.history = new Array<[number, string]>();
    }

    public resetSeed(seed: string): void {
        this.startSeed = seed;
        this.random.setSeed(seed);
        this.history.length = 0;
    }

    public setIndex(index: number): void {
        this._index = index;
    }

    public setSeed(seed: string): void {
        this.random.setSeed(seed);
    }

    public rand(): number {
        while (this._index >= this.history.length) {
            let value = this.random.double();
            this.history.push([value, this.random.seed]);
        }
        const ret = this.history[this._index][0];
        this._index++;
        return ret;
    }

    jsonObj(): any {
        return {
            seedTypeKey: this.seedTypeKey,
            startSeed: this.startSeed,
            history: this.history,
        }
    }
}
