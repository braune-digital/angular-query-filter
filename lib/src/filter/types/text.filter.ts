import { Filter } from '../filter';

export class TextFilter extends Filter {
    public type = 'text';
    public properties: Array<string>;
    public text: string;

    constructor(properties: Array<string>, text: string) {
        super();
        this.properties = properties;
        this.text = text;
    }

    public get(): Object {
        if (this.active) {
            return { filter: this.type, properties: this.properties, text: this.text };
        }
        return null;
    }
}
