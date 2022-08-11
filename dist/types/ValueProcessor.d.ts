export interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
}
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
export declare type ValueFuncType = () => number;
export declare class ValueProcessor {
    protected valueFunc: ValueFuncType;
    constructor(valueFunc: ValueFuncType);
    protected get Value(): number;
    RangeInt(min: number, max: number): number;
    RangeFloat(min: number, max: number): number;
    RangeVec2<Out extends IVec2Like>(out: Out, min: IVec2Like, max: IVec2Like): Out;
    RangeVec3<Out extends IVec3Like>(out: Out, min: IVec3Like, max: IVec3Like): Out;
    RangeVec4<Out extends IVec4Like>(out: Out, min: IVec4Like, max: IVec4Like): Out;
    PointInRect<Out extends IVec2Like>(out: Out, rect: IRectLike): Out;
    PointInAABB<Out extends IVec3Like>(out: Out, aabb: IAABB): Out;
    Color<Out extends IColorLike>(out: Out): Out;
    FloatColor<Out extends IFloatColorLike>(out: Out): Out;
    get Radian(): number;
    get Sign(): number;
    OnUnitCircle<Out extends IVec2Like>(out: Out): Out;
    InsideUnitCircle<Out extends IVec2Like>(out: Out): Out;
    OnUnitSphere<Out extends IVec3Like>(out: Out): Out;
    InsideUnitSphere<Out extends IVec3Like>(out: Out): Out;
    Choice<T>(list: Array<T>): T;
    ChoiceOut<T>(list: Array<T>): T;
}
