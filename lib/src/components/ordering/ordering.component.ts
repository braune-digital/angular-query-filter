import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParamFilter } from '../../utils/paramfilter.class';
import { Ordering } from '../../utils/filter/order';
import {TranslateService} from '@ngx-translate/core';

@Component({
    moduleId: module.id,
    selector: 'ares-ordering',
    templateUrl: 'ordering.component.html',
})
export class OrderingComponent implements OnInit, AfterViewInit {

    @Input('filterService') filterService: ParamFilter;
    @Input('orderKeys') orderKeys: Array<{ key: string; label: string; }>;

    @Output('reorder') reorder: EventEmitter<boolean> = new EventEmitter();

    form: FormGroup;

    private orderings: Array<Ordering> = [];

    constructor(private fb: FormBuilder, private _translateService: TranslateService) { }

    ngOnInit(): void {
        this.form = this.fb.group({ ordering: '' });
        this.orderKeys.forEach(orderKey => {
            this.orderings.push(new Ordering(orderKey.key, 'asc'));
        });
    }

    ngAfterViewInit(): void {
        this.filterService.setOrderings(this.orderings);
    }

    refreshOrdering(toggleAscDesc: boolean = false): void {
        this.orderings = this.orderings.map(ordering => {
            ordering.active = ordering.property === this.form.value.ordering;
            if (toggleAscDesc) {
                if (ordering.ordering === 'asc') {
                    ordering.ordering = 'desc';
                } else {
                    ordering.ordering = 'asc';
                }
            }
            return ordering;
        });

        this.reorder.emit(true);
    }

    getActiveSort() {
        let activeOrdering: Ordering;
        activeOrdering = this.orderings.find(ordering => (ordering.active));
        if (activeOrdering) {
            return activeOrdering.ordering;
        } else {
            return null;
        }
    }
}
