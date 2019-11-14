import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
    providedIn: 'root',
})
export class RestoreService {

    url: string = window.location.href;
    _cache = {};
    _identifier = '_filterCache';


    constructor() {
        if (!sessionStorage.getItem(this._identifier)) {
            sessionStorage.setItem(this._identifier, JSON.stringify(this._cache));
        }
    }

    store(object: any, key: string, unique: string = ''): void {
        this.updateUrl();
        const hash: string = (Md5.hashStr(this.url + key + unique) as string);
        this._cache[hash] = object;
        sessionStorage.setItem(this._identifier, JSON.stringify(this._cache));
    }

    get(key: string, unique: string = ''): any {
        this.updateUrl();
        const hash: string = (Md5.hashStr(this.url + key + unique) as string);
        this._cache = JSON.parse(sessionStorage.getItem(this._identifier));
        return this._cache.hasOwnProperty(hash) ? this._cache[hash] : null;
    }

    updateUrl(): void {
        this.url = window.location.href;
    }

}
