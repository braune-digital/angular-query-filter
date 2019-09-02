import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ordering } from '../../utils/filter/order';
import { ParamFilter } from '../../utils/paramfilter.class';

@Component({
    selector: '[order]',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    @Input() filter: ParamFilter;
    @Input() order: string;
    @Input() active: boolean = false;
    @Input() dir: string;
    @Output() onOrder: EventEmitter<Ordering> = new EventEmitter();

    ordering: Ordering;

    constructor() {
    }

    ngOnInit() {
        this.ordering = this.filter.getOrdering(this.order);
        if (!this.ordering) {
            this.ordering = new Ordering(this.order, (this.dir) ? this.dir : 'asc', this.active);
            this.filter.addOrdering(this.ordering);
        }
    }

    handleOrderClick() {
        this.filter.resetOrderings();
        if (this.ordering.ordering === 'asc') {
            this.ordering.ordering = 'desc';
            this.ordering.active = true;
        } else if (this.ordering.ordering === 'desc') {
            this.ordering.active = false;
            this.ordering.ordering = null;
        } else {
            this.ordering.ordering = 'asc';
            this.ordering.active = true;
        }
        this.onOrder.emit(this.ordering);
        this.filter.refresh();
    }

}
