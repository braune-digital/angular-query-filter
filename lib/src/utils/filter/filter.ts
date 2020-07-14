import { Subject } from 'rxjs';

export abstract class Filter {
    public id: string;
    public type: string;
    public active = true;
    public name = null;
    public refreshEvent = new Subject<boolean>();

    constructor(name?: string) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = (name) ?? null;
    }

    public toJson() {
        if (this.name) {
            return { ...this.get(), name: this.name };
        } else {
            return this.get();
        }
    }

    public abstract get(): object;
}
