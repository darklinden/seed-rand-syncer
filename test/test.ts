import { RandomContainer } from "../src/index";

function GenSeed(): string {
    return ('' + Math.random()).split('.')[1];
}

const rc = new RandomContainer();
rc.setSeed('0', GenSeed());
rc.setSeed('1', GenSeed());
rc.setSeed('2', GenSeed());
rc.setSeed('3', GenSeed());

const choose = 'choose';

rc.setSeed(choose, GenSeed());

const v3Tmp = { x: 0, y: 0, z: 0 };
const v3Min = { x: -10, y: -10, z: -10 };
const v3Max = { x: 10, y: 10, z: 10 };

{
    let id = 0;
    for (let i = 0; i < 10; i++) {
        console.log(i, id = rc.Value(choose).RangeInt(0, 3), rc.Value('' + id).RangeVec3(v3Tmp, v3Min, v3Max));
    }
}

const save = JSON.stringify(rc);

console.log(save);

const rcd = RandomContainer.fromJSON(save);
const rcn = new RandomContainer();

const keys = rc.allkeys();
for (const k of keys)
    rcn.setSeed(k, rc.getSeed(k));


rc.setAllIndex(100);
rcd.setAllIndex(100);
rcn.setAllIndex(100);

{
    let id = 0;
    for (let i = 0; i < 10; i++) {
        console.log(i);
        console.log('rc ', id = rc.Value(choose).RangeInt(0, 3), rc.Value('' + id).RangeVec3(v3Tmp, v3Min, v3Max));
        console.log('rcd', id = rcd.Value(choose).RangeInt(0, 3), rcd.Value('' + id).RangeVec3(v3Tmp, v3Min, v3Max));
        console.log('rcn', id = rcn.Value(choose).RangeInt(0, 3), rcn.Value('' + id).RangeVec3(v3Tmp, v3Min, v3Max));
    }
}