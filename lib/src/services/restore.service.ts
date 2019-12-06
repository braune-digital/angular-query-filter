import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
    providedIn: 'root',
})
export class RestoreService {

    public static url: string = window.location.href;
    public static _cache = {};
    public static _identifier = '_filterCache';
    public static _requestUrl = '';

    constructor() {
        if (!sessionStorage.getItem(RestoreService._identifier)) {
            sessionStorage.setItem(RestoreService._identifier, JSON.stringify(RestoreService._cache));
        }
    }

    static store(object: any, key: string): void {
        RestoreService.updateUrl();
        const hash: string = (Md5.hashStr(RestoreService.url + '?filter=' + key + '&requestUrl=' + RestoreService._requestUrl) as string);
        RestoreService._cache[hash] = object;
        sessionStorage.setItem(RestoreService._identifier, JSON.stringify(RestoreService._cache));
    }

    static get(key: string): any {
        RestoreService.updateUrl();
        const hash: string = (Md5.hashStr(RestoreService.url + '?filter=' + key + '&requestUrl=' + RestoreService._requestUrl) as string);
        RestoreService._cache = JSON.parse(sessionStorage.getItem(RestoreService._identifier));
        return RestoreService._cache.hasOwnProperty(hash) ? RestoreService._cache[hash] : null;
    }

    static updateUrl(): void {
        RestoreService.url = window.location.href;
    }

}
