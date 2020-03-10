import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    Input,
    OnDestroy,
    OnInit,
    QueryList, ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import {ParamFilter} from '../../utils/paramfilter.class';
import {FilterComponent} from '../filter/filter.component';

@Component({
    selector: 'list-container',
    templateUrl: 'list-container.component.html',
    styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnDestroy, OnInit, AfterViewInit {

    @Input()
    filter: ParamFilter;

    @Input()
    hidePagination = false;

    isLoadingEventSubscription: Subscription;

    @Input()
    public firstLoaded = false;

    @ContentChildren(FilterComponent)
    filterComponents: QueryList<FilterComponent>;

    ngOnInit(): void {
        this.isLoadingEventSubscription = this.filter.isLoadingEvent.subscribe(_ => {
            if (!_) {
                this.firstLoaded = true;
            }
        });
    }

    ngAfterViewInit(): void {
        this.filterComponents.forEach(filter => {
            this.filter.add(filter);
        });

        this.filter.isReady.next(true);
    }

    resetFilter(withRefresh: boolean = true): void {
        this.filterComponents.forEach(filterComponent => filterComponent.reset());
        if (withRefresh) {
            this.filter.refresh();
        }
    }

    ngOnDestroy(): void {

        if (this.isLoadingEventSubscription) {
            this.isLoadingEventSubscription.unsubscribe();
        }
        this.firstLoaded = false;
    }

}
