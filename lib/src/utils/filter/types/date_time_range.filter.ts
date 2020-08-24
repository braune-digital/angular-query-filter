import { Filter } from '../filter';
import { format, subDays } from 'date-fns';

export class DateTimeRangeFilter extends Filter {
    public type = 'date_time_range';
    public min: Date = subDays(new Date(), 7);
    public max: Date = new Date();
    public unit: string;
    public property: string;

    constructor(property: string, min: Date, max: Date, unit: string, name?: string) {
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
