/*
 * @author Felix Baltruschat <fb@braune-digital.com>
 * @copyright 08.05.18 17:25 Braune Digital GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Filter } from "../../utils/filter/filter";
import { TranslateService } from "@ngx-translate/core";
import { DateTimeRangeFilter } from "../../utils/filter/types/date_time_range.filter";
import { InstanceofFilter } from "../../utils/filter/types/instanceof.filter";
import { EqualFilter } from "../../utils/filter/types/equal.filter";
import { TextFilter } from "../../utils/filter/types/text.filter";

@Component({
  selector: "filter-component",
  templateUrl: "filter.component.html",
})
export class FilterComponent implements OnInit {
  @Input()
  model: any = null;

  filter: Filter;
  timeoutId: any;
  isResetting = false;
  _options: Array<{ value: any; label: string }> = [];

  @Input()
  type = "text";

  @Input() set options(options: Array<{ value: any; label: string }>) {
    this._options = options.map((_) => {
      return {
        value: _.value,
        label: this.translate.instant(_.label),
      };
    });
  }

  @Input()
  name = Math.random().toString(36).substr(2, 9);

  @Input()
  text: string;

  @Input()
  resetable = true;

  @Input()
  disabled = false;

  @Input()
  selectClass: string;

  @Input()
  selectSearchable = true;

  @Input()
  params: any;

  @Input()
  filterPlaceholder = "";

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
  datepickerTrigger = "click";

  constructor(protected translate: TranslateService) {}
  public getFilter(): Filter {
    return this.filter;
  }

  ngOnInit(): void {
    if (this.filterPlaceholder) {
      this.translate.get(this.filterPlaceholder).subscribe((res: string) => {
        this.filterPlaceholder = res;
      });
    }
    // const filterStored = RestoreService.get(this.name);
    // this.initFilters(filterStored);
  }

  initFilters(filterStored): void {
    switch (this.type) {
      case "text":
        this.addTextType(filterStored);
        break;
      case "select":
        this.addSelectType(filterStored);
        break;
      case "select_like":
        this.addSelectLikeType(filterStored);
        break;
      case "instanceof":
        this.addInstanceOfType(filterStored);
        break;
      case "date_time_range":
        this.addDateTimeRangeType(filterStored);
        break;
    }
  }

  addDateTimeRangeType(filterStored): void {
    if (filterStored) {
      const restoredFilter = filterStored as DateTimeRangeFilter;
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

  private addInstanceOfType(filterStored): void {
    if (filterStored) {
      const restoredFilter = filterStored as InstanceofFilter;
      this.model = restoredFilter.values;
      this.filter = new InstanceofFilter(this.model, restoredFilter.name);
    } else {
      this.filter = new InstanceofFilter(this.model, this.name);
    }
  }

  private addSelectLikeType(filterStored): void {
    if (filterStored) {
      const restoredFilter = filterStored as TextFilter;
      this.model = restoredFilter.text;
      this.filter = new TextFilter(
        restoredFilter.properties,
        this.model,
        restoredFilter.name
      );
    } else {
      this.filter = new TextFilter(
        this.params.properties,
        this.model,
        this.name
      );
      this.filter.active = false;
    }
  }

  private addSelectType(filterStored): void {
    if (filterStored) {
      const restoredFilter = filterStored as EqualFilter;
      this.model = restoredFilter.values;
      this.filter = new EqualFilter(
        restoredFilter.property,
        this.model,
        restoredFilter.name
      );
      this.filter.active = restoredFilter.active;
    } else {
      this.filter = new EqualFilter(this.params.prop, this.model, this.name);
      this.filter.active = false;
    }
  }

  private addTextType(filterStored): void {
    if (filterStored) {
      const restoredFilter = filterStored as TextFilter;
      this.model = restoredFilter.text;
      this.filter = new TextFilter(
        restoredFilter.properties,
        this.model,
        restoredFilter.name
      );
    } else {
      this.filter = new TextFilter(
        this.params.properties,
        this.model,
        this.name
      );
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

  onChange(data: { value: any; label: string }): void {
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
      this.timeoutId ||
      (this.filter instanceof TextFilter && this.filter.text === this.model)
    ) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout((_) => {
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
      this.model = "";
      this.refreshFilter();
    }
  }

  refreshFilter(emitEvent: boolean = true): void {
    if (this.isResetting) {
      return;
    }

    this.filter.name = this.filter.name;

    this.refreshTypes();

    if (emitEvent) {
      this.onRefreshFilter.emit(this.filter);
    }
  }

  refreshTypes(): void {
    switch (this.type) {
      case "text":
        this.refreshTextFilter();
        break;
      case "select":
        this.refreshSelectFilter();
        break;
      case "select_like":
        this.refreshSelectLikeFilter();
        break;
      case "instanceof":
        this.refreshInstanceOfFilter();
        break;
      case "date_time_range":
        this.refreshDateTimeRangeFilter();
        break;
    }
  }

  private refreshDateTimeRangeFilter(): void {
    (this.filter as DateTimeRangeFilter).min = this.lowerDate;
    (this.filter as DateTimeRangeFilter).max = this.upperDate;
    (this.filter as DateTimeRangeFilter).unit = this.model;
  }

  private refreshInstanceOfFilter(): void {
    (this.filter as InstanceofFilter).values = this.model;
  }

  private refreshSelectLikeFilter(): void {
    (this.filter as TextFilter).text = this.model;
  }

  private refreshTextFilter(): void {
    (this.filter as TextFilter).text = this.model;
  }

  private refreshSelectFilter(): void {
    (this.filter as EqualFilter).values = this.model;
  }

  set(value: any, active: boolean = true): void {
    this.model = value;
    this.filter.active = active;
    this.refreshFilter(false);
  }
}
