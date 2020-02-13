import { Filter } from '../filter';

export class IsNotNullFilter extends Filter {
    type = 'is_not_null';
    property: string;

    constructor(property: string, name?: string) {
        super();
        this.property = property;
        this.name = name;
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
