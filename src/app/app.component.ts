import { Component, OnInit } from '@angular/core';
import { ParamFilter } from '../../lib/src/utils/paramfilter.class';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'app';

    filter: ParamFilter;
    data: any;

    constructor(private _api: HttpClient) {
        this.filter = new ParamFilter('https://jsonplaceholder.typicode.com/posts', this._api);
        this.filter.responseEvent.subscribe((_data: Array<any>) => {
            this.data = _data;
        });
    }

    ngOnInit(): void {
        this.filter.refresh();
    }


}
