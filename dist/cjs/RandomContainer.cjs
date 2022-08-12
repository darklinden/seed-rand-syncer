"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomContainer = void 0;
const SeedRandomInstance_1 = require("./SeedRandomInstance.cjs");
class RandomContainer {
    constructor() {
        this.seedRandoms = new Map();
    }
    toJSON() {
        const data = {};
        this.seedRandoms.forEach((v, k) => {
            data[k] = v.toJSON();
        });
        return data;
    }
    static fromJSON(json) {
        const rc = new RandomContainer();
        rc.initWithJSON(json);
        return rc;
    }
    initWithJSON(json) {
        const data = typeof json == 'string' ? JSON.parse(json) : json;
        this.seedRandoms.clear();
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const riv = data[key];
                const ri = SeedRandomInstance_1.SeedRandomInstance.fromJSON(key, riv);
                this.seedRandoms.set(key, ri);
            }
        }
    }
    setSeed(seedType, seed) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance_1.SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.resetSeed(seed);
    }
    allkeys() {
        return Array.from(this.seedRandoms.keys());
    }
    getSeed(seedType) {
        let ri = this.seedRandoms.get(seedType);
        if (ri)
            return ri.seed;
        return null;
    }
    setAllIndex(index) {
        this.seedRandoms.forEach((v, k) => {
            v.setIndex(0);
        });
    }
    setIndex(seedType, index) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri) {
            ri = new SeedRandomInstance_1.SeedRandomInstance(seedType);
            this.seedRandoms.set(seedType, ri);
        }
        ri.setIndex(index);
    }
    Value(seedType) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
        return ri.Value();
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
        ri = new SeedRandomInstance_1.SeedRandomInstance(seedType);
        while (index >= ri.history.length) {
            ri.rand();
        }
        return ri.history[index];
    }
    randomQueue(seedType, startIndex, endIndex) {
        let ri = this.seedRandoms.get(seedType);
        if (!ri)
            throw new Error('RandomContainer.randomNext key [' + seedType + '] not found!');
        ri = new SeedRandomInstance_1.SeedRandomInstance(seedType);
        while (endIndex >= ri.history.length) {
            ri.rand();
        }
        const ret = [];
        ri.history.slice(startIndex, endIndex).forEach(v => {
            ret.push(v);
        });
        return ret;
    }
}
exports.RandomContainer = RandomContainer;
//# sourceMappingURL=RandomContainer.js.map