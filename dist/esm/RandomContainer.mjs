import { SeedRandomInstance } from "./SeedRandomInstance.mjs";
export class RandomContainer {
    constructor() {
        this.seedRandoms = new Map();
    }
    toJSON() {
        const data = {};
        this.seedRandoms.forEach((v, k) => {
            data[k] = v.jsonObj();
        });
        return JSON.stringify(data);
    }
    static fromJSON(json) {
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
    setSeed(seedType, seed) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.resetSeed(seed);
    }
    restart() {
        this.seedRandoms.forEach((v, k) => {
            v.restart();
        });
    }
    randomNext(seedType) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
        ri = new SeedRandomInstance(seedType);
        return ri.rand();
    }
    randomIndex(seedType, index) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
        ri = new SeedRandomInstance(seedType);
        while (index >= ri.history.length) {
            ri.rand();
        }
        return ri.history[index][0];
    }
    randomQueue(seedType, startIndex, endIndex) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
        ri = new SeedRandomInstance(seedType);
        while (endIndex >= ri.history.length) {
            ri.rand();
        }
        const ret = [];
        ri.history.slice(startIndex, endIndex).forEach(v => {
            ret.push(v[0]);
        });
        return ret;
    }
}
//# sourceMappingURL=RandomContainer.js.map