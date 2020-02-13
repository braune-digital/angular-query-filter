import { Filter } from '../filter';

export class InstanceofFilter extends Filter {
    public type = 'instanceof';
    public property = 'id';
    public values: Array<string>;

    constructor(values: Array<string>, name?: string) {
        super();
        this.values = values;
        this.name = name;
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
