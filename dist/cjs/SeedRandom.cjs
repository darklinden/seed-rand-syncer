"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRandom = void 0;
const width = 256;
const chunks = 6;
const digits = 52;
const startdenom = Math.pow(width, chunks);
const significance = Math.pow(2, digits);
const overflow = significance * 2;
const mask = width - 1;
class SeedRandom {
    constructor() {
        this.seed = null;
        this.pool = [];
        this.key = [];
        this.arc4 = {};
    }
    _genArc4(arc4, k) {
        let t = 0;
        let keylen = k.length;
        let i = arc4.i = 0;
        let j = arc4.j = 0;
        let s = arc4.S = [];
        if (!keylen) {
            k = [keylen++];
        }
        while (i < width) {
            s[i] = i++;
        }
        for (i = 0; i < width; i++) {
            s[i] = s[j = mask & (j + k[i % keylen] + (t = s[i]))];
            s[j] = t;
        }
        this._arc4g(arc4, width);
    }
    _arc4g(arc4, count) {
        let t = 0;
        let r = 0;
        let i = arc4.i;
        let j = arc4.j;
        let s = arc4.S;
        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }
        arc4.i = i;
        arc4.j = j;
        return r;
    }
    _prng(arc4) {
        var n = this._arc4g(arc4, chunks), d = startdenom, x = 0;
        while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = this._arc4g(arc4, 1);
        }
        while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
        }
        return (n + x) / d;
    }
    _int32(arc4) { return this._arc4g(arc4, 4) | 0; }
    _quick(arc4) { return this._arc4g(arc4, 4) / 0x100000000; }
    _double(arc4) { return this._prng(arc4); }
    setScene(seed, key, pool) {
        if (seed && seed.length)
            this.seed = seed;
        if (key)
            this.key = [...key];
        if (pool)
            this.pool = [...pool];
    }
    get scene() {
        return {
            seed: this.seed,
            key: [...this.key],
            pool: [...this.pool]
        };
    }
    _flatten(obj, depth) {
        let result = [];
        const typ = (typeof obj);
        let prop;
        if (depth && typ == 'object') {
            for (prop in obj) {
                try {
                    result.push(this._flatten(obj[prop], depth - 1));
                }
                catch (e) {
                }
            }
        }
        if (result instanceof Array && result.length) {
            return result;
        }
        if (typ == 'string') {
            return obj;
        }
        return obj + '\0';
    }
    _mixkey(seed, key) {
        let stringseed = seed + '';
        let smear = 0;
        let j = 0;
        while (j < stringseed.length) {
            key[mask & j] =
                mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
        }
        return this._tostring(key);
    }
    _tostring(a) {
        return String.fromCharCode.apply(0, a);
    }
    random() {
        this._mixkey(this._flatten(this.seed, 3), this.key);
        this._genArc4(this.arc4, this.key);
        this._mixkey(this._tostring(this.arc4.S), this.pool);
        return this._prng(this.arc4);
    }
    int32() {
        this._mixkey(this._flatten(this.seed, 3), this.key);
        this._genArc4(this.arc4, this.key);
        this._mixkey(this._tostring(this.arc4.S), this.pool);
        return this._int32(this.arc4);
    }
    quick() {
        this._mixkey(this._flatten(this.seed, 3), this.key);
        this._genArc4(this.arc4, this.key);
        this._mixkey(this._tostring(this.arc4.S), this.pool);
        return this._quick(this.arc4);
    }
    double() {
        return this.random();
    }
    range(from, to) {
        return from + (this.random() * (to - from));
    }
    rangeInt(from, to) {
        return Math.floor(from + (this.random() * (to - from)));
    }
}
exports.SeedRandom = SeedRandom;
//# sourceMappingURL=SeedRandom.js.map