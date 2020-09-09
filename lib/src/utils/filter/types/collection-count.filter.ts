import { Filter } from '../filter';

export class CollectionCountFilter extends Filter {
    public type = 'collection-count';
    public min: number = null;
    public max: number = null;
    public unit: string;
    public property: string;

    constructor(property: string, min: number = null, max: number = null, unit: string, name?: string) {
        super(name);
        this.property = property;
        this.min = min;
        this.max = max;
        this.unit = unit;
    }

    public get(): Object {
        if (this.active) {
            const obj =  {
                filter: this.type,
                property: this.property,
                min: this.min,
                max: this.max
            };

            Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
            return obj;
        }
        return null;
    }
}
