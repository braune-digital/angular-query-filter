import { Filter } from '../filter';

export class AndFilter extends Filter {

    public type = 'and';
    public filters: Array<Filter>;

    constructor(filters: Array<Filter>, name?: string) {
        super();
        this.filters = filters;
        this.name = name;
    }

    public get(): object {
        if (!this.active) {
            return null;
        }
        const filterArray: Array<Object> = [];
        this.filters.forEach(filter => {
            const f = filter.get();
            if (f) {
                filterArray.push(f);
            }
        });
        return {
            filter: this.type,
            filters: filterArray
        };
    }
}
