export class Ordering {
    public type = 'ordering';
    public property: string;
    public ordering: string;

    public active: boolean;

    constructor(property: string, ordering: string, active: boolean = false) {
        this.property = property;
        this.ordering = ordering;
        this.active = active;
    }
}
