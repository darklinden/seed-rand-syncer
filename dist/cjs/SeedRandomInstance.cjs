"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRandomInstance = void 0;
const SeedRandom_1 = require("./SeedRandom.cjs");
class SeedRandomInstance {
    constructor(seedTypeKey) {
        this.seedTypeKey = seedTypeKey;
        this.random = new SeedRandom_1.SeedRandom(null);
        this.history = new Array();
    }
    resetSeed(seed) {
        this.startSeed = seed;
        this.random.setSeed(seed);
        this.history.length = 0;
    }
    restart() {
        this.resetSeed(this.startSeed);
    }
    setSeed(seed) {
        this.random.setSeed(seed);
    }
    rand() {
        const value = this.random.double();
        this.history.push([value, this.random.seed]);
        return value;
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