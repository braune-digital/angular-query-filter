import { Subject } from 'rxjs';

export abstract class Filter {
    public id: string;
    public type: string;
    public active = true;
    public refreshEvent = new Subject<boolean>();

    constructor() {
    }

    public abstract get(): object;
}
