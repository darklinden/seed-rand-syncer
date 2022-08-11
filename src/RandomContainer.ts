import { SeedRandomInstance } from "./SeedRandomInstance";

export class RandomContainer {

    toJSON(): any {
        const data: any = {};
        this.seedRandoms.forEach((v, k) => {
            data[k] = v.jsonObj();
        });
        return data;
    }

    public static fromJSON(json: string | any): RandomContainer {
        const data = typeof json == 'string' ? JSON.parse(json) : json;
        const rc = new RandomContainer();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const riv = data[key];
                const ri = new SeedRandomInstance(key);
                ri.startSeed = riv.startSeed;
                if (riv.history && riv.history.length) {
                    ri.history.push(...riv.history);
                    ri.setSeed(riv.history[ri.history.length - 1][1]);
                }
                else
                    ri.setSeed(riv.startSeed);
                rc.seedRandoms.set(key, ri);
            }
        }
        return rc;
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
        return ri.history[index][0];
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
            ret.push(v[0]);
        });
        return ret;
    }
}