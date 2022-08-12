
// convert from https://github.com/XJINE/Unity_RandomEx


// value max 255
export interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
}

// value max 1
export interface IFloatColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IVec2Like {
    x: number;
    y: number;
}

export interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

export interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface IAABB {
    center: IVec3Like;
    halfExtents: IVec3Like;
}

const RADIAN_MIN: number = 0;
const RADIAN_MAX: number = 6.283185307179586;

export type ValueFuncType = () => number;
export class ValueProcessor {

    protected valueFunc: ValueFuncType = null;

    constructor(valueFunc: ValueFuncType) {
        this.valueFunc = valueFunc;
    }

    public get Value(): number { return this.valueFunc(); }

    // Rangs
    public RangeInt(min: number/**int */, max: number/**int */): number /**int */ {
        return Math.floor(min + (max - min + 1) * this.Value);
    }

    public RangeFloat(min: number/**float */, max: number/**float */) {
        return min + (max - min) * this.Value;
    }

    public RangeVec2<Out extends IVec2Like>(out: Out, min: IVec2Like, max: IVec2Like): Out {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        return out;
    }

    public RangeVec3<Out extends IVec3Like>(out: Out, min: IVec3Like, max: IVec3Like) {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        out.z = this.RangeFloat(min.z, max.z);
        return out;
    }

    public RangeVec4<Out extends IVec4Like>(out: Out, min: IVec4Like, max: IVec4Like) {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        out.z = this.RangeFloat(min.z, max.z);
        out.w = this.RangeFloat(min.w, max.w);
        return out;
    }

    public PointInRect<Out extends IVec2Like>(out: Out, rect: IRectLike): Out {
        const xMin = rect.x;
        const yMin = rect.y;
        const xMax = rect.x + rect.width;
        const yMax = rect.y + rect.height;
        out.x = this.RangeFloat(xMin, xMax);
        out.y = this.RangeFloat(yMin, yMax);
        return out;
    }

    public PointInAABB<Out extends IVec3Like>(out: Out, aabb: IAABB): Out {
        out.x = this.RangeFloat(aabb.center.x - aabb.halfExtents.x, aabb.center.x + aabb.halfExtents.x);
        out.y = this.RangeFloat(aabb.center.y - aabb.halfExtents.y, aabb.center.y + aabb.halfExtents.y);
        out.z = this.RangeFloat(aabb.center.z - aabb.halfExtents.z, aabb.center.z + aabb.halfExtents.z);
        return out;
    }

    public Color<Out extends IColorLike>(out: Out): Out {
        out.r = this.RangeInt(0, 255);
        out.g = this.RangeInt(0, 255);
        out.b = this.RangeInt(0, 255);
        out.a = this.RangeInt(0, 255);
        return out;
    }

    public FloatColor<Out extends IFloatColorLike>(out: Out): Out {
        out.r = this.RangeFloat(0, 1);
        out.g = this.RangeFloat(0, 1);
        out.b = this.RangeFloat(0, 1);
        out.a = this.RangeFloat(0, 1);
        return out;
    }

    public get Radian(): number/**float */ { return this.RangeFloat(RADIAN_MIN, RADIAN_MAX); }

    public get Sign(): number/**int */ { return this.RangeFloat(-1, 1) > 0 ? 1 : -1; }

    public OnUnitCircle<Out extends IVec2Like>(out: Out): Out {
        let angle = this.Radian;

        out.x = Math.cos(angle);
        out.y = Math.sin(angle);

        return out;
    }

    public InsideUnitCircle<Out extends IVec2Like>(out: Out): Out {
        let angle = this.Radian;
        let radius = this.Value;

        out.x = Math.cos(angle) * radius;
        out.y = Math.sin(angle) * radius;
        return out;
    }

    public OnUnitSphere<Out extends IVec3Like>(out: Out): Out {
        let angle1 = this.Radian;
        let angle2 = this.Radian;

        out.x = Math.sin(angle1) * Math.cos(angle2);
        out.y = Math.sin(angle1) * Math.sin(angle2);
        out.z = Math.cos(angle1);

        return out;
    }

    public InsideUnitSphere<Out extends IVec3Like>(out: Out): Out {

        let angle1 = this.Radian;
        let angle2 = this.Radian;
        let radius = this.Value;

        out.x = Math.sin(angle1) * Math.cos(angle2) * radius;
        out.y = Math.sin(angle1) * Math.sin(angle2) * radius;
        out.z = Math.cos(angle1) * radius;

        return out;
    }

    public Choice<T>(list: Array<T>): T {
        if (list && list.length) {
            return list[Math.floor(this.Value * list.length)];
        }
        return null;
    }

    public ChoiceOut<T>(list: Array<T>): T {
        if (list && list.length) {
            let index = Math.floor(this.Value * list.length);
            return list.splice(index, 1)[0];
        }
        return null;
    }
}