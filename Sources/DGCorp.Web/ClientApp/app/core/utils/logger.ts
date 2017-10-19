import { Injectable, isDevMode } from '@angular/core';

/**
 * @whatItDoes Allows unit testing of logging to console. Similar to `$log` from AngularJS.
 *
 * @description
 *
 * This service will be removed/deprecated if https://github.com/angular/angular/pull/14308 lands.
 *
 * @stable
 */
@Injectable()
export class Logger {
    debug(value: any, ...rest: any[]) {
        if (isDevMode()) {
            console.debug(value, ...rest);
        }
    }

    warn(value: any, ...rest: any[]) {
        console.warn(value, ...rest);
    }

    error(value: any, ...rest: any[]) {
        console.error(value, ...rest);
    }
}
