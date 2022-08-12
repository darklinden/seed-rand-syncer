"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRandomInstance = void 0;
const SeedRandom_1 = require("./SeedRandom.cjs");
const ValueProcessor_1 = require("./ValueProcessor.cjs");
const SEED_LEN = 16;
class SeedRandomInstance {
    constructor(seedTypeKey) {
        this._index = 0;
        this._valueProcessor = null;
        this.seedTypeKey = seedTypeKey;
        this.random = new SeedRandom_1.SeedRandom();
        this.history = new Array();
    }
    get index() { return this._index; }
    normalizeSeed(seed) {
        if (!seed || !seed.length)
            throw new Error('SeedRandomInstance.normalizeSeed seed should not be null! ' + this.seedTypeKey);
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
    resetSeed(seed) {
        this.random.setScene(this.normalizeSeed(seed), [], []);
        this.history.length = 0;
    }
    get seed() {
        return this.random.seed;
    }
    setIndex(index) {
        this._index = index;
    }
    rand() {
        while (this._index >= this.history.length) {
            let value = this.random.double();
            this.history.push(value);
        }
        const ret = this.history[this._index];
        this._index++;
        return ret;
    }
    Value() {
        if (!this._valueProcessor) {
            this._valueProcessor = new ValueProcessor_1.ValueProcessor(() => { return this.rand(); });
        }
        return this._valueProcessor;
    }
    initFromJSON(json) {
        const data = typeof json == 'string' ? JSON.parse(json) : json;
        this.history.length = 0;
        if (data.history && data.history.length) {
            this.history.push(...data.history);
        }
        if (data.scene) {
            this.random.setScene(data.scene.seed, data.scene.key, data.scene.pool);
        }
    }
    static fromJSON(key, json) {
        const sri = new SeedRandomInstance(key);
        sri.initFromJSON(json);
        return sri;
    }
    toJSON() {
        return {
            seedTypeKey: this.seedTypeKey,
            history: this.history,
            scene: this.random.scene
        };
    }
}
exports.SeedRandomInstance = SeedRandomInstance;
//# sourceMappingURL=SeedRandomInstance.js.map