import { Filter } from '../filter';

export class IsNullFilter extends Filter {
    type = 'is_null';
    property: string;

    constructor(property: string, name?: string) {
        super(name);
        this.property = property;
    }

    public get(): Object {
        if (this.active) {
            return {
                filter: this.type,
                property: this.property
            };
        }
        return null;
    }
}
