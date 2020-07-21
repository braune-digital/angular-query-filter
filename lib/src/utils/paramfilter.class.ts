import { Observable, BehaviorSubject } from 'rxjs';
import { Filter } from './filter/filter';
import { Ordering } from './filter/order';
import { AndFilter } from './filter/types/and.filter';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { FilterComponent } from '../components/filter/filter.component';
import * as qs from 'qs';
import { TextFilter } from './filter/types/text.filter';
import { DateTimeRangeFilter } from './filter/types/date_time_range.filter';
import { EqualFilter } from './filter/types/equal.filter';
import { InFilter } from './filter/types/in.filter';
import { InstanceofFilter } from './filter/types/instanceof.filter';
import { IsNotNullFilter } from './filter/types/is-not-null.filter';
import { IsNullFilter } from './filter/types/is-null.filter';

export class ParamFilter<E = Object> {

    static resultKeys: number[] = [10, 25, 50];
    public resultKeys = ParamFilter.resultKeys;

    public filters: Array<Filter> = [];
    public orderings: Array<Ordering> = [];

    public page = 1;
    public limitDisplayPages = 5;

    public range: { total: number, pages: number, from?: number, to?: number } = { total: 0, pages: 0 };

    public responseEvent: BehaviorSubject<Array<E>> = new BehaviorSubject([]);
    public isLoadingEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public isReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public resultsPerPage = 10;
    public grouped = false;
    public useQueryParameter = false;

    constructor(
        private _requestUrl: string,
        private api: HttpClient,
        private params: Object = {},
        private withScope: boolean = true,
        private headers: HttpHeaders | { [header: string]: string | string[]; } = {},
    ) {
        this.rebuildData();
    }

    public rebuildData(): void {
        if (this.useQueryParameter === false) {
            return;
        }

        const query = Object.assign({}, this.parseQueryParameter(window.location.search));
        if (query['page']) {
            this.page = Number(query['page']);
        }
        if (query['resultsPerPage']) {
            this.resultsPerPage = Number(query['resultsPerPage']);
        }
        if (query['filter']) {
            this.filters = this.parseFilterFromObject(JSON.parse(query['filter']));
        }
    }

    public parseFilterFromObject(filters: Array<object>): Array<Filter> {
        const data = [];
        filters.forEach(filter => {
            if (!filter['name']) {
                return;
            }
            switch (filter['filter']) {
                case 'and':
                    data.push(new AndFilter((filter['filters']) ? this.parseFilterFromObject(filter['filters']) : [], filter['name']));
                    break;
                case 'text':
                    data.push(new TextFilter(filter['properties'] ?? [], (filter['text']) ?? '', filter['name']));
                    break;
                case 'is_null':
                    data.push(new IsNullFilter(filter['property'] ?? '', filter['name']));
                    break;
                case 'is_not_null':
                    data.push(new IsNotNullFilter(filter['property'] ?? '', filter['name']));
                    break;
                case 'instanceof':
                    data.push(new InstanceofFilter(filter['values'] ?? [], filter['name']));
                    break;
                case 'in':
                    data.push(new InFilter(filter['property'] ?? '', (filter['values']) ?? [], filter['name']));
                    break;
                case 'equal':
                    data.push(new EqualFilter(filter['property'] ?? '', (filter['values']) ?? [], filter['name']));
                    break;
                case 'date_time_range':
                    data.push(new DateTimeRangeFilter(filter['property'] ?? '', (filter['min']) ?? '', (filter['max']) ?? '', (filter['unit']) ?? '', filter['name']));
                    break;
            }
        });
        return data;
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
        if (this.useQueryParameter) {
            history.pushState({}, null, window.location.pathname + '?' + this.buildQueryParameter());
        }
        return this.api.get<Array<E>>(
            this.requestUrl + '?' + this.buildQueryParameter(),
            {
                observe: 'response',
                headers: this.headers
            }
        ).pipe(
            tap(response => this.preparePagination(response)),
            map(response => response.body)
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
                this.range = { total: 0, pages: 0 };
            } else {
                this.range = { total: 0, pages: 0 };
            }

            this.range['pages'] = Math.ceil((this.range ? this.range.total : response.json().length) / this.resultsPerPage);

            if (this.page <= 0) {
                this.page = this.range['pages'];
            }
        }
    }

    public add(filter: FilterComponent | Filter): void {
        if (!filter) {
            return;
        }
        let f: Filter;
        if (filter instanceof Filter) {
            f = filter;
        } else if (filter instanceof FilterComponent) {
            f = filter.filter;
        }

        if (this.filters.findIndex(item => item.name === f.name) < 0) {
            this.filters.push(f);
        } else {
            this.filters[this.filters.findIndex(item => item.name === f.name)] = f;
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
        const filterObjects: Array<object> = [];
        if (this.filters) {
            if (this.filters.length === 1) {
                const filter = this.filters[0].toJson();
                if (filter) {
                    filterObjects.push(filter);
                }
            } else {
                const andFilter = new AndFilter(this.filters);
                filterObjects.push(andFilter.toJson());
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

        searchParams['filter'] = JSON.stringify(filterObjects);
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

    public removeOrdering(ordering: Ordering) {
        this.orderings = this.orderings.filter(obj => obj !== ordering);
        this.refresh();
    }

    public getFilter(): Array<Filter> {
        return this.filters;
    }

    public removeFilter(name: string) {
        this.filters = this.filters.filter(filter => filter.name !== name);
    }

    public setParams(queryParams: { [param: string]: string }) {
        this.params = queryParams;
        this.refresh();
    }

    public buildQueryParameter(): string {
        return qs.stringify(this.build());

    }

    public parseQueryParameter(query: string): object {
        if (!query) {
            return {};
        }
        return qs.parse(query.substring(1));
    }

    public removeParams() {
        this.params = {};
        this.refresh();
    }

    get requestUrl(): string {
        return this._requestUrl;
    }

    set requestUrl(value: string) {
        this._requestUrl = value;
    }

}
