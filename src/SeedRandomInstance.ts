import { SeedRandom } from "./SeedRandom";
import { ValueProcessor } from "./ValueProcessor";

const SEED_LEN = 16;
export class SeedRandomInstance {

    public seedTypeKey: string;
    public history: Array<number>;

    protected _index: number = 0;
    public get index(): number { return this._index; }

    protected random: SeedRandom;

    constructor(seedTypeKey: string) {
        this.seedTypeKey = seedTypeKey
        this.random = new SeedRandom();
        this.history = new Array<number>();
    }

    protected normalizeSeed(seed: string): string {
        if (!seed || !seed.length) throw new Error('SeedRandomInstance.normalizeSeed seed should not be null! ' + this.seedTypeKey);

        while (seed.length < SEED_LEN) {
            const last = seed[seed.length - 1];
            const lastIdx = parseInt(last);
            if (!isNaN(lastIdx)) {
                seed += seed[lastIdx % seed.length];
            }
            else {
                seed += last;
            }
        }

        if (seed.length > SEED_LEN) {
            seed = seed.substring(0, SEED_LEN);
        }

        return seed;
    }

    public resetSeed(seed: string): void {
        this.random.setScene(this.normalizeSeed(seed), [], []);
        this.history.length = 0;
    }

    public get seed(): string {
        return this.random.seed;
    }

    public setIndex(index: number): void {
        this._index = index;
    }

    public rand(): number {
        while (this._index >= this.history.length) {
            let value = this.random.double();
            this.history.push(value);
        }
        const ret = this.history[this._index];
        this._index++;
        return ret;
    }

    private _valueProcessor: ValueProcessor = null;
    public Value(): ValueProcessor {
        if (!this._valueProcessor) {
            this._valueProcessor = new ValueProcessor(() => { return this.rand() });
        }
        return this._valueProcessor;
    }

    initFromJSON(json: string | any): void {
        const data = typeof json == 'string' ? JSON.parse(json) : json;

        this.history.length = 0;
        if (data.history && data.history.length) {
            this.history.push(...data.history);
        }

        if (data.scene) {
            this.random.setScene(data.scene.seed, data.scene.key, data.scene.pool);
        }
    }

    static fromJSON(key: string, json: string | any): SeedRandomInstance {
        const sri = new SeedRandomInstance(key);
        sri.initFromJSON(json);
        return sri;
    }

    toJSON(): any {
        return {
            seedTypeKey: this.seedTypeKey,
            history: this.history,
            scene: this.random.scene
        }
    }
}
