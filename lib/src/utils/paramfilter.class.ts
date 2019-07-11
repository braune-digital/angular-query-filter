import {Observable, BehaviorSubject} from 'rxjs';
import {Filter} from './filter/filter';
import {Ordering} from './filter/order';
import {AndFilter} from './filter/types/and.filter';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {FilterComponent} from '../components/filter/filter.component';
import {Md5} from 'ts-md5/dist/md5';
import {RestoreService} from '../services/restore.service';

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

    resultsPerPage = 10;
    grouped = false;

    // Storage
    storageUrl = window.location.href + '/searchparams';
    filterObjects: Array<object> = [];
    orderingsObjects: { [key: string]: string } = {};

    constructor(
        private _requestUrl: string,
        private api: HttpClient,
        private params: Object = {},
        private withScope: boolean = true,
        private headers: HttpHeaders | { [header: string]: string | string[]; } = {},
        private restoreService: RestoreService = new RestoreService(),
    ) {
        
        // Restore pagination from storage
        if (sessionStorage.getItem(this.storageUrl)) {
            this.params = JSON.parse(sessionStorage.getItem(this.storageUrl));
            this.orderingsObjects = JSON.parse(this.params['order']);

            Object.entries(this.orderingsObjects).forEach( ordering => {
                const tempOrdering: Ordering = new Ordering('', '');
                tempOrdering.property = ordering[0];
                tempOrdering.ordering = ordering[1];
                this.addOrdering(tempOrdering);
            });

            this.page = parseInt(this.params['page']);
            this.resultsPerPage = parseInt(this.params['resultsPerPage']);
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
                observe: 'response',
                headers: this.headers
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
    }

    public addOrdering(ordering: Ordering): void {
        if (this.orderings.indexOf(ordering) < 0) {
            this.orderings.push(ordering);
        }
    }

    public setOrderings(orderings: Array<Ordering>): void {
        this.orderings = orderings;
    }

    public build(): any {

        const searchParams = this.params;

        if (this.filters) {
            if (this.filters.length === 1) {
                const filter = this.filters[0].get();
                if (filter) {
                    this.filterObjects.push(filter);
                }
            } else {
                const andFilter = new AndFilter(this.filters);
                this.filterObjects[0] = andFilter.get();
            }
        }

        if (this.orderings) {
            this.orderings.forEach(ordering => {
                if (ordering.active) {
                    this.orderingsObjects[ordering.property] = ordering.ordering;
                }
            });
        }

        const filterObjectsString = JSON.stringify(this.filterObjects);

        if (this.filtersFromLastRequest && this.filtersFromLastRequest !== filterObjectsString) {
            this.page = 1;
        }
        this.filtersFromLastRequest = JSON.stringify(this.filterObjects);

        searchParams['filter'] = filterObjectsString;
        searchParams['order'] = JSON.stringify(this.orderingsObjects);
        searchParams['page'] = this.page.toString();
        searchParams['resultsPerPage'] = this.resultsPerPage.toString();
        if (this.grouped) {
            searchParams['grouped'] = this.grouped.toString();
        }

        // Store filters in sessionStorage
        this.restoreService.storeFiltersByName(this.filters);

        // Store searchparams to sessionStorage. this is for ordering and resultsPerPage
        sessionStorage.setItem(this.storageUrl, JSON.stringify(searchParams));

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

    public removeOrdering(ordering: Ordering) {
        this.orderings = this.orderings.filter(obj => obj !== ordering);
        this.refresh();
    }

    public getFilter(): Array<Filter> {
        return this.filters;
    }


    get requestUrl(): string {
        return this._requestUrl;
    }

    set requestUrl(value: string) {
        this._requestUrl = value;
    }
}
