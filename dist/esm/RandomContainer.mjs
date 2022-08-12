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
        return data;
    }
    static fromJSON(json) {
        const data = typeof json == 'string' ? JSON.parse(json) : json;
        const rc = new RandomContainer();
        rc.initWithJSON(data);
        return rc;
    }
    initWithJSON(data) {
        this.seedRandoms.clear();
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
                this.seedRandoms.set(key, ri);
            }
        }
    }
    setSeed(seedType, seed) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.resetSeed(seed);
    }
    setAllIndex(index) {
        this.seedRandoms.forEach((v, k) => {
            v.setIndex(0);
        });
    }
    setIndex(seedType, index) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.setIndex(index);
    }
    randomNext(seedType) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
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