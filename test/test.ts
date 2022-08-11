import { RandomContainer, ValueProcessor } from "../src/index";

const rc = new RandomContainer();
rc.setSeed('0', '' + Math.random());
rc.setSeed('1', '' + Math.random());
rc.setSeed('2', '' + Math.random());
rc.setSeed('3', '' + Math.random());

const choose = 'choose';

rc.setSeed(choose, '' + Math.random());

const rv = new ValueProcessor(() => { return rc.randomNext(choose); })
const rvList = new Array<ValueProcessor>();
for (let i = 0; i < 4; i++) {
    rvList.push(new ValueProcessor(() => { return rc.randomNext('' + i); }))
}

for (let i = 0; i < 10; i++) {
    const id = rv.RangeInt(0, 3);
    console.log(id, rvList[id].Sign);
}

const save = JSON.stringify(rc);

console.log(save);

const rcd = RandomContainer.fromJSON(save);

rcd.setAllIndex(0);

{
    const rv = new ValueProcessor(() => { return rcd.randomNext(choose); })
    const rvList = new Array<ValueProcessor>();
    for (let i = 0; i < 4; i++) {
        rvList.push(new ValueProcessor(() => { return rcd.randomNext('' + i); }))
    }

    for (let i = 0; i < 10; i++) {
        const id = rv.RangeInt(0, 3);
        console.log(id, rvList[id].Sign);
    }
}