import {Injectable} from '@angular/core';
import {Filter} from '../utils/filter/filter';
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
    providedIn: 'root',
})
export class RestoreService {

    url = window.location.href + '/filter/';

    storeFilterByName(filter: Filter) {
        sessionStorage.setItem((Md5.hashStr( this.url + filter.name ).toString()), JSON.stringify(filter));
    }

    storeFiltersByName(_filters: Array<Filter>){
        _filters.forEach((_filter) => {
            console.log(_filter);
            sessionStorage.setItem(this.url + _filter.name, JSON.stringify(_filter));
        });
    }

    getFilterByName(name: string): any {
        return JSON.parse(sessionStorage.getItem(this.url + name));
    }
}
