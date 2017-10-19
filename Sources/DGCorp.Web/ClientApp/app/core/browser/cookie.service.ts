import { Injectable } from '@angular/core';
import { CookieService as BaseCookieService, CookieOptions } from 'ngx-cookie';
import { CookieOptionsProvider } from 'ngx-cookie/src/cookie-options-provider';

import { WindowRef } from './window-ref.service';

export { CookieOptions };

/**
 * @whatItDoes Manipulates cookies.
 *
 * @description
 *
 * This service inherits from [angular2-cookie](https://github.com/salemdar/angular2-cookie) `CookieService`
 * and adds some `ASP.NET` specific methods.
 *
 * Vanilla out of the box sets default options for written cookies with this service:
 *  - domain - `page.domain`
 *  - path - `/`
 *
 * @stable
 */
@Injectable()
export class CookieService extends BaseCookieService {
    constructor(cookieOptionsProvider: CookieOptionsProvider, private windowRef: WindowRef) {
        super(cookieOptionsProvider);
    }

    /**
     * Same as `put`, but doesn't use `encodeURIComponent` on `name` and `value`.
     */
    putRaw(name: string, value: any, options?: CookieOptions) {
        const opts = options = Object.assign({}, this.options, options);
        let expires = opts.expires;

        if (value == null) {
            expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
            value = '';
        }
        if (typeof (expires) === 'string') {
            expires = new Date(expires);
        }

        let str = name + '=' + value;

        str += opts.path ? ';path=' + opts.path : '';
        str += opts.domain ? ';domain=' + opts.domain : '';
        str += expires ? ';expires=' + expires.toUTCString() : '';
        str += opts.secure ? ';secure' : '';

        this.windowRef.nativeWindow.document.cookie = str;
    }

    /**
     * Adds an item to cookie formated as query string (parsable by ASP.NET).
     *
     * E.g.
     *  - existing cookie `xxx` with value `a=b`
     *  - `cookieService.addToQueryCollection('xxx', 'c', 'd');`
     *  - `cookieService.addToQueryCollection('xxx', 'a', 'e');`
     *  - cookie now has value `a=b|e&c=d`
     */
    addToQueryCollection(name: string, key: string, value: string, options?: CookieOptions) {
        let cookieValue = this.get(name);

        if (!cookieValue) {
            cookieValue = `${key}=${encodeURIComponent(value)}`;
        } else {
            let parts = cookieValue.split('&');
            let index = -1;

            for (let i = 0; i < parts.length; i++) { // Find part for specified key
                if (parts[i].indexOf(`${key}=`) === 0) {
                    index = i;
                }
            }

            if (index >= 0) {
                parts[index] = `${parts[index]}|${encodeURIComponent(value)}`;
            } else {
                parts.push(key + '=' + encodeURIComponent(value));
            }
            cookieValue = parts.join('&');
        }

        this.putRaw(name, cookieValue, options);
    }
}
