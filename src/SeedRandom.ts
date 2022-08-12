/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

//
// The following constants are related to IEEE 754 limits.
// https://github.com/davidbau/seedrandom/blob/released/seedrandom.js
//

const width = 256;        // each RC4 output is 0 <= x < 256
const chunks = 6;         // at least six RC4 outputs for each double
const digits = 52;        // there are 52 significant digits in a double
const startdenom = Math.pow(width, chunks);
const significance = Math.pow(2, digits);
const overflow = significance * 2;
const mask = width - 1;

interface IARC4 {
    i?: number;
    j?: number;
    S?: number[];
}

interface IRandScene {
    seed: string;
    key?: number[];
    pool?: number[];
}

export class SeedRandom {

    //
    // ARC4
    //
    // An ARC4 implementation.  The constructor takes a key in the form of
    // an array of at most (width) integers that should be 0 <= x < (width).
    //
    // The g(count) method returns a pseudorandom integer that concatenates
    // the next (count) outputs from ARC4.  Its return value is a number x
    // that is in the range 0 <= x < (width ^ count).
    //
    private _genArc4(arc4: IARC4, k: number[]): void {
        let t = 0;
        let keylen = k.length;
        let i = arc4.i = 0;
        let j = arc4.j = 0;
        let s: number[] = arc4.S = [];

        // The empty key [] is treated as [0].
        if (!keylen) { k = [keylen++]; }

        // Set up S using the standard key scheduling algorithm.
        while (i < width) {
            s[i] = i++;
        }

        for (i = 0; i < width; i++) {
            s[i] = s[j = mask & (j + k[i % keylen] + (t = s[i]))];
            s[j] = t;
        }

        this._arc4g(arc4, width);
    }

    // The "g" method returns the next (count) outputs as one number.
    private _arc4g(arc4: IARC4, count: number): number {
        // Using instance members instead of closure state nearly doubles speed.
        let t = 0;
        let r = 0;
        let i = arc4.i;
        let j = arc4.j
        let s = arc4.S;

        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }

        arc4.i = i;
        arc4.j = j;
        return r;
        // For robust unpredictability, the function call below automatically
        // discards an initial batch of values.  This is called RC4-drop[256].
        // See http://google.com/search?q=rsa+fluhrer+response&btnI
    }

    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.
    private _prng(arc4: IARC4) {
        var n = this._arc4g(arc4, chunks), // Start with a numerator n < 2 ^ 48
            d = startdenom, //   and denominator d = 2 ^ 48.
            x = 0; //   and no 'extra last byte'.
        while (n < significance) { // Fill up all significant digits by
            n = (n + x) * width; //   shifting numerator and
            d *= width; //   denominator and generating a
            x = this._arc4g(arc4, 1); //   new least-significant-byte.
        }
        while (n >= overflow) { // To avoid rounding up, before adding
            n /= 2; //   last byte, shift everything
            d /= 2; //   right using integer math until
            x >>>= 1; //   we have exactly the desired bits.
        }
        return (n + x) / d; // Form the number within [0, 1).
    }

    private _int32(arc4: IARC4) { return this._arc4g(arc4, 4) | 0; }
    private _quick(arc4: IARC4) { return this._arc4g(arc4, 4) / 0x100000000; }
    private _double(arc4: IARC4) { return this._prng(arc4); }

    seed: string = null;
    pool: number[] = [];
    key: number[] = [];

    //
    // When seedrandom.js is loaded, we immediately mix a few bits
    // from the built-in RNG into the entropy pool.  Because we do
    // not want to interfere with deterministic PRNG state later,
    // seedrandom will not call math.random on its own again after
    // initialization.
    //
    // mixkey(math.random(), pool);

    public setScene(seed: string, key: number[], pool: number[]) {
        if (seed && seed.length) this.seed = seed;
        if (key) this.key = [...key];
        if (pool) this.pool = [...pool];
    }

    public get scene(): IRandScene {
        return {
            seed: this.seed,
            key: [...this.key],
            pool: [...this.pool]
        };
    }

    //
    // flatten()
    // Converts an object tree to nested arrays of strings.
    //
    private _flatten(obj: string | any, depth: number): string[] | string {
        let result: string[] = [];
        const typ = (typeof obj);
        let prop;
        if (depth && typ == 'object') {
            for (prop in obj) {
                try {
                    result.push(this._flatten(obj[prop], depth - 1) as string);
                }
                catch (e) {
                }
            }
        }

        if (result instanceof Array && result.length) {
            return result;
        }

        if (typ == 'string') {
            return obj as string;
        }

        return obj + '\0';
    }

    //
    // mixkey()
    // Mixes a string seed into a key that is an array of integers, and
    // returns a shortened string seed that is equivalent to the result key.
    //
    private _mixkey(seed: string | string[], key: number[]): string {
        let stringseed = seed + '';
        let smear = 0;
        let j = 0;
        while (j < stringseed.length) {
            key[mask & j] =
                mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
        }
        return this._tostring(key);
    }

    //
    // tostring()
    // Converts an array of charcodes to a string
    //
    private _tostring(a: number[]): string {
        return String.fromCharCode.apply(0, a);
    }

    private arc4: IARC4 = {};

    public random(): number {

        // Flatten the seed string or build one from local entropy if needed.
        this._mixkey(this._flatten(this.seed, 3), this.key);

        // Use the seed to initialize an ARC4 generator.
        this._genArc4(this.arc4, this.key)

        // Mix the randomness into accumulated entropy.
        this._mixkey(this._tostring(this.arc4.S), this.pool);

        // Calling convention: what to return as a function of prng, seed, is_math.
        return this._prng(this.arc4);
    }

    public int32(): number {

        // Flatten the seed string or build one from local entropy if needed.
        this._mixkey(this._flatten(this.seed, 3), this.key);

        // Use the seed to initialize an ARC4 generator.
        this._genArc4(this.arc4, this.key)

        // Mix the randomness into accumulated entropy.
        this._mixkey(this._tostring(this.arc4.S), this.pool);

        // Calling convention: what to return as a function of prng, seed, is_math.
        return this._int32(this.arc4);
    }

    public quick(): number {

        // Flatten the seed string or build one from local entropy if needed.
        this._mixkey(this._flatten(this.seed, 3), this.key);

        // Use the seed to initialize an ARC4 generator.
        this._genArc4(this.arc4, this.key)

        // Mix the randomness into accumulated entropy.
        this._mixkey(this._tostring(this.arc4.S), this.pool);

        // Calling convention: what to return as a function of prng, seed, is_math.
        return this._quick(this.arc4);
    }

    public double(): number {
        return this.random();
    }

    public range(from: number, to: number): number {
        return from + (this.random() * (to - from));
    }

    public rangeInt(from: number, to: number): number {
        return Math.floor(from + (this.random() * (to - from)));
    }
}