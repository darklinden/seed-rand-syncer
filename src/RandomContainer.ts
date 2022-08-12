import { SeedRandomInstance } from "./SeedRandomInstance";
import { ValueProcessor } from "./ValueProcessor";

export class RandomContainer {

    toJSON(): any {
        const data: any = {};
        this.seedRandoms.forEach((v, k) => {
            data[k] = v.toJSON();
        });
        return data;
    }

    public static fromJSON(json: string | any): RandomContainer {
        const rc = new RandomContainer();
        rc.initWithJSON(json);
        return rc;
    }

    public initWithJSON(json: string | any): void {
        const data = typeof json == 'string' ? JSON.parse(json) : json;
        this.seedRandoms.clear();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const riv = data[key];
                const ri = SeedRandomInstance.fromJSON(key, riv);
                this.seedRandoms.set(key, ri);
            }
        }
    }

    protected seedRandoms: Map<string, SeedRandomInstance> = new Map<string, SeedRandomInstance>();

    public setSeed(seedType: string, seed: string) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.resetSeed(seed);
    }

    public allkeys(): Array<string> {
        return Array.from(this.seedRandoms.keys());
    }

    public getSeed(seedType: string): string {
        let ri = this.seedRandoms.get(seedType);
        if (ri) return ri.seed;
        return null;
    }

    public setAllIndex(index: number): void {
        this.seedRandoms.forEach((v, k) => {
            v.setIndex(0);
        });
    }

    public setIndex(seedType: string, index: number): void {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.setIndex(index);
    }

    public Value(seedType: string): ValueProcessor {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');

        return ri.Value();
    }

    public randomNext(seedType: string): number {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');

        return ri.rand();
    }

    public randomIndex(seedType: string, index: number): number {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');

        ri = new SeedRandomInstance(seedType);
        while (index >= ri.history.length) {
            ri.rand();
        }
        return ri.history[index];
    }

    public randomQueue(seedType: string, startIndex: number, endIndex: number): Array<number> {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');

        ri = new SeedRandomInstance(seedType);
        while (endIndex >= ri.history.length) {
            ri.rand();
        }

        const ret: Array<number> = [];
        ri.history.slice(startIndex, endIndex).forEach(v => {
            ret.push(v);
        });
        return ret;
    }
}