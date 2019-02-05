import {DateTimeRangeFilter} from './date_time_range.filter';
import { format } from "date-fns";

export class DateTimeRangeFixedIntervalFilter extends DateTimeRangeFilter {

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
