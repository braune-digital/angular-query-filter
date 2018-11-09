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
  @Output() onOrder: EventEmitter<Ordering> = new EventEmitter();

  ordering: Ordering;

  constructor() { }

  ngOnInit() {
    this.ordering = this.filter.getOrdering(this.order);
    if(!this.ordering){
      console.log(this.order);
      console.log(this.filter);
      this.ordering = new Ordering(this.order, 'desc', false);
      this.filter.addOrdering(this.ordering);
        console.log(this.filter);
    }
  }

  handleOrderClick(){
    this.filter.resetOrderings();
    if(this.ordering.ordering === 'desc') {
      this.ordering.ordering = 'asc';
    } else {
      this.ordering.ordering = 'desc';
    }
    this.ordering.active = true;
    this.onOrder.emit(this.ordering);
    this.filter.refresh();
  }

}
