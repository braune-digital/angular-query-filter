/*
 * @author Felix Baltruschat <fb@braune-digital.com>
 * @copyright 08.05.18 17:25 Braune Digital GmbH
 */

import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Filter } from '../../utils/filter/filter';
import { TextFilter } from '../../utils/filter/types/text.filter';
import { EqualFilter } from '../../utils/filter/types/equal.filter';
import {InstanceofFilter} from '../../utils/filter/types/instanceof.filter';
import {DateTimeRangeFilter} from '../../utils/filter/types/date_time_range.filter';

@Component({
    selector: 'filter-component',
    templateUrl: 'filter.component.html'
})
export class FilterComponent implements AfterViewInit, OnInit {

    model: any = null;
    filter: Filter;
    timeoutId: any;
    isResetting = false;
    _options: Array<{ value: any; label: string }> = [];

    @Input()
    type = 'text';

    @Input() set options(options: Array<{ value: any; label: string }>) {
        this._options = options.map(_ => {
            return {
          value: _.value,
          label: this.translate.instant(_.label)
        };
      });
    }

    @Input()
    resetable = true;

    @Input()
    selectClass: string;

    @Input()
    params: any;

    @Input()
    filterPlaceholder = '';

    @Output()
    onRefreshFilter: EventEmitter<Filter> = new EventEmitter();

    /* Inputs for DateRange and Datepicker */
    /* Initialize lower and upper Date for default selection from very first date until today */
    @Input()
    lowerDate: Date = new Date(0);

    @Input()
    upperDate: Date = new Date();

    /* Min- and Maximum Date for picking Range*/
    @Input()
    minDate: Date = new Date();

    @Input()
    maxDate: Date = new Date();

    @Input()
    lang: string;

    /* Triggers for bsDatepicker */
    @Input()
    datepickerTrigger = 'click';

    constructor(private translate: TranslateService) {}

    public getFilter(): Filter {
        return this.filter;
    }

    ngAfterViewInit(): void {
        switch (this.type) {
            case 'text':
                this.filter = new TextFilter(this.params.properties, this.model);
                break;
            case 'select':
                this.filter = new EqualFilter(this.params.prop, this.model);
                this.filter.active = false;
                break;
            case 'instanceof':
                this.filter = new InstanceofFilter(this.model);
                break;
            case 'date-time-range':
                this.filter = new DateTimeRangeFilter(this.params.prop, this.lowerDate, this.upperDate,  this.model);
                break;
        }
    }

    ngOnInit(): void {
        if (this.filterPlaceholder) {
            this.translate.get(this.filterPlaceholder).subscribe((res: string) => {
                this.filterPlaceholder = res;
            });
        }
    }

    /* Get Dates and set them to current filter*/
    onDatesPicked(dates: Array<Date>) {
        if (dates && dates.length === 2) {
            this.lowerDate = dates[0];
            this.upperDate = dates[1];
        } else {
            this.lowerDate = new Date(0);
            this.upperDate = new Date();
        }
        this.refreshFilter();

    }

    onChange(data: { value: any, label: string }): void {
        if (data) {
          this.model = data.value;
        } else {
          this.model = null;
        }
        this.filter.active = this.model !== null;
        this.refreshFilter();
    }

    onKeyPress(): void {
        this.filter.active = true;
        if (
            this.timeoutId
            || this.filter instanceof TextFilter && this.filter.text === this.model
        ) {
            window.clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(() => {
            this.refreshFilter();
        }, 500);
    }

    onRemove(): void {
        this.model = null;
        this.filter.active = false;
        this.refreshFilter();
    }

    reset(): void {
        this.isResetting = true;
        this.model = null;
        this.filter.active = false;
        this.isResetting = false;
    }

    resetSearch(): void {
        if (this.model) {
            this.model = '';
            this.refreshFilter();
        }
    }

    refreshFilter(emitEvent: boolean = true): void {
        if (this.isResetting) {
            return;
        }
        if (this.filter instanceof TextFilter) {
            this.filter.text = this.model;
        } else if (this.filter instanceof EqualFilter || this.filter instanceof InstanceofFilter) {
            this.filter.values = [this.model];
        } else if (this.filter instanceof DateTimeRangeFilter) {
            this.filter.min = this.lowerDate;
            this.filter.max = this.upperDate;
        }
        if (emitEvent) {
            this.onRefreshFilter.emit(this.filter);
        }
    }

    set(value: any, active: boolean = true): void {
        this.model = value;
        this.filter.active = active;
        this.refreshFilter(false);
    }
}
