const RADIAN_MIN = 0;
const RADIAN_MAX = 6.283185307179586;
export class ValueProcessor {
    constructor(valueFunc) {
        this.valueFunc = null;
        this.valueFunc = valueFunc;
    }
    get Value() { return this.valueFunc(); }
    RangeInt(min, max) {
        return Math.floor(min + (max - min + 1) * this.Value);
    }
    RangeFloat(min, max) {
        return min + (max - min) * this.Value;
    }
    RangeVec2(out, min, max) {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        return out;
    }
    RangeVec3(out, min, max) {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        out.z = this.RangeFloat(min.z, max.z);
        return out;
    }
    RangeVec4(out, min, max) {
        out.x = this.RangeFloat(min.x, max.x);
        out.y = this.RangeFloat(min.y, max.y);
        out.z = this.RangeFloat(min.z, max.z);
        out.w = this.RangeFloat(min.w, max.w);
        return out;
    }
    PointInRect(out, rect) {
        const xMin = rect.x;
        const yMin = rect.y;
        const xMax = rect.x + rect.width;
        const yMax = rect.y + rect.height;
        out.x = this.RangeFloat(xMin, xMax);
        out.y = this.RangeFloat(yMin, yMax);
        return out;
    }
    PointInAABB(out, aabb) {
        out.x = this.RangeFloat(aabb.center.x - aabb.halfExtents.x, aabb.center.x + aabb.halfExtents.x);
        out.y = this.RangeFloat(aabb.center.y - aabb.halfExtents.y, aabb.center.y + aabb.halfExtents.y);
        out.z = this.RangeFloat(aabb.center.z - aabb.halfExtents.z, aabb.center.z + aabb.halfExtents.z);
        return out;
    }
    Color(out) {
        out.r = this.RangeInt(0, 255);
        out.g = this.RangeInt(0, 255);
        out.b = this.RangeInt(0, 255);
        out.a = this.RangeInt(0, 255);
        return out;
    }
    FloatColor(out) {
        out.r = this.RangeFloat(0, 1);
        out.g = this.RangeFloat(0, 1);
        out.b = this.RangeFloat(0, 1);
        out.a = this.RangeFloat(0, 1);
        return out;
    }
    get Radian() { return this.RangeFloat(RADIAN_MIN, RADIAN_MAX); }
    get Sign() { return this.RangeFloat(-1, 1) > 0 ? 1 : -1; }
    OnUnitCircle(out) {
        let angle = this.Radian;
        out.x = Math.cos(angle);
        out.y = Math.sin(angle);
        return out;
    }
    InsideUnitCircle(out) {
        let angle = this.Radian;
        let radius = this.Value;
        out.x = Math.cos(angle) * radius;
        out.y = Math.sin(angle) * radius;
        return out;
    }
    OnUnitSphere(out) {
        let angle1 = this.Radian;
        let angle2 = this.Radian;
        out.x = Math.sin(angle1) * Math.cos(angle2);
        out.y = Math.sin(angle1) * Math.sin(angle2);
        out.z = Math.cos(angle1);
        return out;
    }
    InsideUnitSphere(out) {
        let angle1 = this.Radian;
        let angle2 = this.Radian;
        let radius = this.Value;
        out.x = Math.sin(angle1) * Math.cos(angle2) * radius;
        out.y = Math.sin(angle1) * Math.sin(angle2) * radius;
        out.z = Math.cos(angle1) * radius;
        return out;
    }
    Choice(list) {
        if (list && list.length) {
            return list[Math.floor(this.Value * list.length)];
        }
        return null;
    }
    ChoiceOut(list) {
        if (list && list.length) {
            let index = Math.floor(this.Value * list.length);
            return list.splice(index, 1)[0];
        }
        return null;
    }
}
//# sourceMappingURL=ValueProcessor.js.map