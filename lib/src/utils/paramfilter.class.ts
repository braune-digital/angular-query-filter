import {Response} from '@angular/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {Filter} from './filter/filter';
import {Ordering} from './filter/order';
import {AndFilter} from './filter/types/and.filter';
import {HttpClient} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {FilterComponent} from '../components/filter/filter.component';
import {AsyncSubject} from 'rxjs/AsyncSubject';

export class ParamFilter<E = Object> {

    static resultKeys: number[] = [10, 25, 50];
    public resultKeys = ParamFilter.resultKeys;

    filters: Array<Filter> = [];
    orderings: Array<Ordering> = [];

    page = 1;
    limitDisplayPages = 3;

    range: { total: number, pages: number, from?: number, to?: number } = {total: 0, pages: 0};

    responseEvent: BehaviorSubject<Array<E>> = new BehaviorSubject([]);
    isLoadingEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);
    isReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    filtersFromLastRequest: string;

    withScope = true;

    resultsPerPage = 10;
    grouped = false;


    constructor(private _requestUrl: string, private api: HttpClient, private params:Object = {}, withScope?: boolean) {
        if (withScope !== undefined) {
            this.withScope = withScope;
        }

    }

    public refresh(): void {
        this.isLoadingEvent.next(true);
        this.refreshPromise()
            .subscribe((response: Array<E>) => {
                this.responseEvent.next(response);
                this.isLoadingEvent.next(false);
            });
    }

    public refreshPromise(): Observable<any> {
        return this.api.get<Array<E>>(
            this.requestUrl,
            {
                params: this.build(),
                observe: 'response'
            }
        ).pipe(
            tap(response => this.preparePagination(response)),
            map( response => response.body)
        );
    }

    preparePagination(response: any): void {
        if (response.headers.has('Content-Range')) {
            const hdr = response.headers.get('Content-Range');
            const m = hdr && hdr.match(/^(?:items )?(\d+)-(\d+)\/(\d+|\*)$/);
            if (m) {
                this.range = {
                    from: +m[1],
                    to: +m[2],
                    total: m[3] === '*' ? Infinity : +m[3],
                    pages: 0
                };
            } else if (hdr === '*/0') {
                this.range = {total: 0, pages: 0};
            } else {
                this.range = {total: 0, pages: 0};
            }
            this.range['pages'] = Math.ceil((this.range ? this.range.total : response.json().length) / this.resultsPerPage);
        }
    }

    public add(filter: FilterComponent | Filter): void {
        let f: Filter;
        if (filter instanceof Filter) {
            f = filter;
        } else if (filter instanceof FilterComponent) {
            f = filter.filter;
        }

        if (this.filters.indexOf(f) < 0) {
            this.filters.push(f);
        } else {
            this.filters[this.filters.findIndex(item => item.id === f.id)] = f;
        }

        this.build();
    }

    public addOrdering(ordering: Ordering): void {
        if (this.orderings.indexOf(ordering) < 0) {
            this.orderings.push(ordering);
        }
        this.build();
    }

    public setOrderings(orderings: Array<Ordering>): void {
        this.orderings = orderings;
        this.build();
    }

    public build(): any {
        const searchParams = this.params;
        const filterObjects: Array<object> = [];
        if (this.filters) {
            if (this.filters.length === 1) {
                const filter = this.filters[0].get();
                if (filter) {
                    filterObjects.push(filter);
                }
            } else {
                const andFilter = new AndFilter(this.filters);
                filterObjects.push(andFilter.get());
            }
        }

        const orderings: { [key: string]: string } = {};
        if (this.orderings) {
            this.orderings.forEach(ordering => {
                if (ordering.active) {
                    orderings[ordering.property] = ordering.ordering;
                }
            });
        }

        const filterObjectsString = JSON.stringify(filterObjects);

        if (this.filtersFromLastRequest && this.filtersFromLastRequest !== filterObjectsString) {
            this.page = 1;
        }
        this.filtersFromLastRequest = JSON.stringify(filterObjects);

        searchParams['filter'] = filterObjectsString;
        searchParams['order'] = JSON.stringify(orderings);
        searchParams['page'] = this.page.toString();
        searchParams['resultsPerPage'] = this.resultsPerPage.toString();
        if (this.grouped) {
            searchParams['grouped'] = this.grouped.toString();
        }


        return searchParams;
    }

    setResultsPerPage(results: number): void {
        this.page = 1;
        this.resultsPerPage = results;
    }

    getResultsPerPage(): number {
        return this.resultsPerPage;
    }

    public getOrdering(property: string): Ordering {
        return this.orderings.find(order => (order.property === property));
    }

    public resetOrderings(refresh: boolean = false): void {
        this.orderings.forEach(order => order.active = false);
        if (refresh) {
            this.refresh();
        }
    }

    get requestUrl(): string {
        return this._requestUrl;
    }

    set requestUrl(value: string) {
        this._requestUrl = value;
    }
}
