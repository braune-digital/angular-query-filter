import { Filter } from '../filter';
import { format, subDays } from 'date-fns';

export class DateTimeRangeFilter extends Filter {
    public type = 'date_time_range';
    public min: Date = subDays(new Date(), 7);
    public max: Date = new Date();
    public unit: string;
    public property: string;

    constructor(property: string, min: Date, max: Date, unit: string) {
        super();
        this.property = property;
        this.min = min;
        this.max = max;
        this.unit = unit;
    }

    public get(): Object {
        if (this.active) {
            return {
                filter: this.type,
                property: this.property,
                min: format(this.min, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                max: format(this.max, 'YYYY-MM-DDTHH:mm:ss.SSSZZ')
            };
        }
        return null;
    }
}
