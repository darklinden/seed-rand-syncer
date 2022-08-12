"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRandomInstance = void 0;
const SeedRandom_1 = require("./SeedRandom.cjs");
class SeedRandomInstance {
    constructor(seedTypeKey) {
        this._index = 0;
        this.seedTypeKey = seedTypeKey;
        this.random = new SeedRandom_1.SeedRandom(null);
        this.history = new Array();
    }
    get index() { return this._index; }
    resetSeed(seed) {
        this.startSeed = seed;
        this.random.setSeed(seed);
        this.history.length = 0;
    }
    setIndex(index) {
        this._index = index;
    }
    setSeed(seed) {
        this.random.setSeed(seed);
    }
    rand() {
        while (this._index >= this.history.length) {
            let value = this.random.double();
            this.history.push([value, this.random.seed]);
        }
        const ret = this.history[this._index][0];
        this._index++;
        return ret;
    }
    jsonObj() {
        return {
            seedTypeKey: this.seedTypeKey,
            startSeed: this.startSeed,
            history: this.history,
        };
    }
}
exports.SeedRandomInstance = SeedRandomInstance;
//# sourceMappingURL=SeedRandomInstance.js.map