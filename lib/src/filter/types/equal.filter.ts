import { Filter } from '../filter';

export class EqualFilter extends Filter {
    public type = 'equal';
    public property: string;
    public values: Array<string | number>;

    constructor(property: string, values: Array<string | number>) {
        super();
        this.property = property;
        this.values = values;
    }

    public get(): Object {
        if (this.active) {
            return { filter: this.type, property: this.property, values: this.values };
        }
        return null;
    }
}
