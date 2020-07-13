import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BdFilterModule } from '../../lib/src/filter.module';
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from '@ngx-translate/core';
import { FormUtilitiesModule } from '@braune-digital/form-utilities';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        BdFilterModule,
        FormUtilitiesModule.forRoot(),
        TranslateModule.forRoot(),
        DatepickerModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
