import { Filter } from '../filter';

export class InFilter extends Filter {
    type = 'in';
    property: string;
    values: Array<string | number>;

    constructor(property: string, values: Array<string | number>, name?: string) {
        super(name);
        this.property = property;
        this.values = values;
    }

    public get(): Object {
        if (this.active) {
            return {
                filter: this.type,
                property: this.property,
                values: this.values
            };
        }
        return null;
    }
}
