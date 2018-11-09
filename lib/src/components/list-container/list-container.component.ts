import {AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ParamFilter} from '../../utils/paramfilter.class';
import {FilterComponent} from '../filter/filter.component';
import {Ordering} from '../../utils/filter/order';

@Component({
    moduleId: module.id,
    selector: 'list-container',
    templateUrl: 'list-container.component.html',
    styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input("filter") filter: ParamFilter;
    isLoadingEventSubscription: Subscription;
    public firstLoaded: boolean = false;
    @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;

    ngOnInit(): void {
        this.isLoadingEventSubscription = this.filter.isLoadingEvent.subscribe(_ => {
            if (!_) {
                this.firstLoaded = true;
            }
        });
    }

    ngAfterViewInit(): void {
        this.filterComponents.forEach(filter => this.filter.add(filter));
    }

    resetFilter(withRefresh: boolean = true): void {
        this.filterComponents.forEach(filterComponent => filterComponent.reset());
        if (withRefresh) {
            this.filter.refresh();
        }
    }

    ngOnDestroy(): void {
        this.isLoadingEventSubscription.unsubscribe();
        this.firstLoaded = false;
    }

}
