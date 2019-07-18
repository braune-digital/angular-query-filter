import { Subject } from 'rxjs';

export abstract class Filter {
    public id: string;
    public type: string;
    public active = true;
    public name = '';
    public refreshEvent = new Subject<boolean>();

    constructor() {
        this.id =  Math.random().toString(36).substr(2, 9);
    }

    public toJson() {
        return { ...this.get(), name: this.name };
    }

    public abstract get(): object;
}
