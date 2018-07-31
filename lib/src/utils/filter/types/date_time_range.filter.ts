import { Filter } from '../filter';
import * as moment_ from 'moment';
import { Moment } from 'moment';

const moment = moment_;

export class DateTimeRangeFilter extends Filter {
    public type = 'date_time_range';
    public min: Moment = moment().subtract('day', 7);
    public max: Moment = moment();
    public unit: string;
    public property: string;

    constructor(property: string, min: Moment, max: Moment, unit: string) {
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
                min: this.min.toISOString(),
                max: this.max.toISOString()
            };
        }
        return null;
    }
}
