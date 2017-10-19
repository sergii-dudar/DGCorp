import { Injectable } from '@angular/core';

function getWindow (): Window {
    return window;
}

/**
 * @whatItDoes Wraps browser `window`.
 *
 * @howToUse
 *
 * ```
 * console.log(this.windowRef.nativeWindow.location.href);
 * // logs current url
 * ```
 *
 * @description
 *
 * This service functions similarly as `$window` in AngularJS. Allows for easy mocking of `window`.
 *
 * @stable
 */
@Injectable()
export class WindowRef {
    get nativeWindow (): Window {
        return getWindow();
    }
}
