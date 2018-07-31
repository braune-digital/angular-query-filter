import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParamFilter } from '../../utils/paramfilter.class';

@Component({
    moduleId: module.id,
    selector: 'results-per-page',
    templateUrl: 'results-per-page.component.html',
})
export class ResultsPerPageComponent implements OnInit {

    @Input('filterService') filterService: ParamFilter;
    @Input('resultKeys') resultKeys: Array<number>;

    @Output('refreshedResultsPerPage') refreshedResultsPerPage: EventEmitter<boolean> = new EventEmitter();

    form: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.form = this.fb.group({ pagination: this.filterService.getResultsPerPage() });
    }

    refreshResultsPerPage(): void {
        this.filterService.setResultsPerPage(this.form.value.pagination);
        this.refreshedResultsPerPage.emit(true);
    }
}
