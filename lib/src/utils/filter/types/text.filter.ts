import { Filter } from '../filter';

export class TextFilter extends Filter {
    public type = 'text';
    public properties: Array<string>;
    public text: string;

    constructor(properties: Array<string>, text: string, name?: string) {
        super();
        this.properties = properties;
        this.text = text;
        this.name = name;
    }

    public get(): Object {
        if (this.active) {
            return {
                filter: this.type,
                properties: this.properties,
                text: this.text,
                name: this.name
            };
        }
        return null;
    }
}
