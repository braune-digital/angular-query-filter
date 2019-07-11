/*
 * @author Felix Baltruschat <fb@braune-digital.com>
 * @copyright 08.05.18 17:25 Braune Digital GmbH
 */

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Filter } from '../../utils/filter/filter';
import { TextFilter } from '../../utils/filter/types/text.filter';
import { EqualFilter } from '../../utils/filter/types/equal.filter';
import {InstanceofFilter} from '../../utils/filter/types/instanceof.filter';
import {DateTimeRangeFilter} from '../../utils/filter/types/date_time_range.filter';
import {RestoreService} from '../../services/restore.service';

@Component({
    selector: 'filter-component',
    templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit, AfterViewInit {

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
    name = '';

    @Input()
    text: string;

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

    constructor(
        private translate: TranslateService,
        private restoreService: RestoreService
    ) {}

    public getFilter(): Filter {
        return this.filter;
    }

    ngOnInit(): void {


        if (this.filterPlaceholder) {
            this.translate.get(this.filterPlaceholder).subscribe((res: string) => {
                this.filterPlaceholder = res;
            });
        }

        if (this.type === 'date_time_range') {
            if (this.restoreService.getFilterByName(this.name)) {
                const restoredFilter = this.restoreService.getFilterByName(this.name) as DateTimeRangeFilter;
                this.model = restoredFilter.unit;
                this.filter = new DateTimeRangeFilter(
                    restoredFilter.property,
                    restoredFilter.min,
                    restoredFilter.max,
                    this.model,
                    restoredFilter.name
                );
            } else {
                this.filter = new DateTimeRangeFilter(
                    this.params.prop,
                    this.lowerDate,
                    this.upperDate,
                    this.model,
                    this.name
                );
            }
        }
    }

    ngAfterViewInit() {
        let filterIsStored = false;

        if (this.restoreService.getFilterByName(this.name)) {
            filterIsStored = true;
        }

        // Check if filters are in sessionStorage. If there is a Filter, the filter will be initialized as new filter with existing values
        // otherwise a new instance of a filter will be set up

        switch (this.type) {
            case 'text':
                if (filterIsStored) {
                    const restoredFilter = this.restoreService.getFilterByName(this.name) as TextFilter;
                    this.model = restoredFilter.text;
                    this.filter = new TextFilter(restoredFilter.properties, this.model, restoredFilter.name);
                } else {
                    this.filter = new TextFilter(this.params.properties, this.model, this.name);
                }
                break;

            case 'select':
                if (filterIsStored) {
                    const restoredFilter = this.restoreService.getFilterByName(this.name) as EqualFilter;
                    this.model = restoredFilter.values;
                    this.filter = new EqualFilter(restoredFilter.property, this.model, restoredFilter.name);
                    this.filter.active = restoredFilter.active;
                } else {
                    this.filter = new EqualFilter(this.params.prop, this.model, this.name);
                    this.filter.active = false;
                }
                break;

            case 'select_like':
                if (filterIsStored) {
                    const restoredFilter = this.restoreService.getFilterByName(this.name) as TextFilter;
                    this.model = restoredFilter.text;
                    this.filter = new TextFilter(restoredFilter.properties, this.model, restoredFilter.name);
                } else {
                    this.filter = new TextFilter(this.params.properties, this.model, this.name);
                    this.filter.active = false;
                }
                break;

            case 'instanceof':
                if (filterIsStored) {
                    const restoredFilter = this.restoreService.getFilterByName(this.name) as InstanceofFilter;
                    this.model = restoredFilter.values;
                    this.filter = new InstanceofFilter(this.model, restoredFilter.name);
                } else {
                    this.filter = new InstanceofFilter(this.model, this.name);
                }

                break;
            case 'date_time_range':
                if (filterIsStored) {
                    const restoredFilter = this.restoreService.getFilterByName(this.name) as DateTimeRangeFilter;
                    this.model = restoredFilter.unit;
                    this.filter = new DateTimeRangeFilter(
                        restoredFilter.property,
                        restoredFilter.min,
                        restoredFilter.max,
                        this.model,
                        restoredFilter.name
                    );
                } else {
                    this.filter = new DateTimeRangeFilter(
                        this.params.prop,
                        this.lowerDate,
                        this.upperDate,
                        this.model,
                        this.name
                    );
                }
                break;
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

        switch (this.type) {
            case 'text':
                (this.filter as TextFilter).text = this.model;
                break;

            case 'select':
                (this.filter as EqualFilter).values = this.model;
                break;

            case 'select_like':
                (this.filter as EqualFilter).values = [this.model];
                break;

            case 'instanceof':
                (this.filter as InstanceofFilter).values = this.model;
                break;

            case 'date_time_range':
                (this.filter as DateTimeRangeFilter).min = this.lowerDate;
                (this.filter as DateTimeRangeFilter).max = this.upperDate;
                (this.filter as DateTimeRangeFilter).unit = this.model;
                break;
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
