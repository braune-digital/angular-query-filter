import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    Input,
    OnDestroy,
    OnInit,
    QueryList
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ParamFilter } from '../../utils/paramfilter.class';
import { FilterComponent } from '../filter/filter.component';

@Component({
    moduleId: module.id,
    selector: 'infinity-list',
    templateUrl: 'infinity-list.component.html',
    styleUrls: ['./infinity-list.component.scss']
})
export class InfinityListComponent implements OnDestroy, OnInit, AfterContentInit, AfterViewInit {

    @Input('filter')
    filter: ParamFilter;

    @ContentChildren(FilterComponent)
    filterComponents: QueryList<FilterComponent>;

    isLoadingEventSubscription: Subscription;
    firstLoaded = false;

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


    ngAfterContentInit(): void {
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

    loadNext() {
        this.filter.page++;
        this.filter.refresh();
    }

}
