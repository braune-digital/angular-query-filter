import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, Provider} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ResultsPerPageComponent } from './components/results-per-page/results-per-page.component';
import { PaginationFilterComponent } from './components/pagination/pagination.component';
import { OrderingComponent } from './components/ordering/ordering.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { DatepickerModule, PaginationModule} from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormUtilitiesModule} from '@braune-digital/form-utilities';
import { FilterComponent } from './components/filter/filter.component';
import { ListLoadingComponent } from './components/loading/list-loading.component';
import { ListContainerComponent } from './components/list-container/list-container.component';
import { OrderComponent } from './components/order/order.component';
import { InfinityListComponent } from './components/infinity-list/infinity-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        TranslateModule,
        DatepickerModule,
        NgSelectModule,
        PaginationModule,
        FormUtilitiesModule
    ],
    declarations: [
        ResultsPerPageComponent,
        PaginationFilterComponent,
        OrderingComponent,
        FilterComponent,
        ListLoadingComponent,
        ListContainerComponent,
        InfinityListComponent,
        OrderComponent
    ],
    exports: [
        ResultsPerPageComponent,
        PaginationFilterComponent,
        OrderingComponent,
        FilterComponent,
        ListLoadingComponent,
        ListContainerComponent,
        InfinityListComponent,
        OrderComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BdFilterModule {
    static forRoot(): ModuleWithProviders<BdFilterModule> {
        return {
            ngModule: BdFilterModule,
            providers: []
        };
    }
}
