import { SeedRandom } from "./SeedRandom.mjs";
export class SeedRandomInstance {
    constructor(seedTypeKey) {
        this.seedTypeKey = seedTypeKey;
        this.random = new SeedRandom(null);
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
//# sourceMappingURL=SeedRandomInstance.js.map