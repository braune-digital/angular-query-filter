import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ResultsPerPageComponent} from './components/results-per-page/results-per-page.component';
import {PaginationFilterComponent} from './components/pagination/pagination.component';
import {OrderingComponent} from './components/ordering/ordering.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {PaginationModule} from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormUtilitiesModule} from '@braune-digital/form-utilities';
import {FilterComponent} from './components/filter/filter.component';
import {ListLoadingComponent} from './components/loading/list-loading.component';
import {ListContainerComponent} from './components/list-container/list-container.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        TranslateModule,
        NgSelectModule,
        PaginationModule,
        FormUtilitiesModule.forRoot({displayErrors: false})
    ],
    declarations: [
        ResultsPerPageComponent,
        PaginationFilterComponent,
        OrderingComponent,
        FilterComponent,
        ListLoadingComponent,
        ListContainerComponent
    ],
    exports: [
        ResultsPerPageComponent,
        PaginationFilterComponent,
        OrderingComponent,
        FilterComponent,
        ListLoadingComponent,
        ListContainerComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BdFilterModule {
}
