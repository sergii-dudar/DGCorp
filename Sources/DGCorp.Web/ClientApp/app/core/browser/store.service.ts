import { Injectable, Inject, InjectionToken } from '@angular/core';

import { WindowRef } from './window-ref.service';

/**
 * Prefix used by {@link SessionStoreService} and {@link LocalStoreService}.
 *
 * @stable
 */
export const STORE_PREFIX = new InjectionToken<string>('vn-store-prefix');

/**
 * Base service for browser storage services.
 *
 * @stable
 */
export abstract class StoreService {
    constructor(private backend: Storage, private prefix: string) {
    }

    get(key: string) {
        const item = this.backend.getItem(this.prefix + key);
        if (item) {
            return JSON.parse(item);
        } else {
            return item;
        }
    }

    set(key: string, value: any) {
        if (value == null) {
            this.backend.removeItem(this.prefix + key);
        } else {
            this.backend.setItem(this.prefix + key, JSON.stringify(value));
        }
    }

    remove(key: string) {
        this.backend.removeItem(this.prefix + key);
    }
}

/**
 * @whatItDoes Provides access to local and session storage of the browser
 *
 * @howToUse
 *
 * register store prefix
 * ```
 * import { STORE_PREFIX } from '@vanilla/core';
 *
 * @NgModule({
 *     providers: [
 *         { provide: STORE_PREFIX, useValue: 'your_prefix.' }
 *     ]
 * })
 * export class AppModule { }
 * ```
 *
 * ```
 * sessionStoreService.set('key', 'value');
 * sessionStoreService.get('key');
 * sessionStoreService.remove('key');
 * ```
 *
 * @description
 *
 * A wrapper for [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage).
 *
 * `sessionStorage` maintains a storage area that's available for the duration of the page session.
 * A page session lasts for as long as the browser is open and survives over page reloads and restores.
 * Opening a page in a new tab or window will cause a new session to be initiated.
 *
 * The keys under which data is stored is automatically prefixed with the prefix set by `STORE_PREFIX`.
 *
 * @stable
 */
@Injectable()
export class SessionStoreService extends StoreService {
    constructor(windowRef: WindowRef, @Inject(STORE_PREFIX) prefix: string) {
        super(getBackend(windowRef, 'session'), prefix);
    }
}

/**
 * @whatItDoes Provides access to local and session storage of the browser
 *
 * @howToUse
 *
 * register store prefix
 * ```
 * import { STORE_PREFIX } from '@vanilla/core';
 *
 * @NgModule({
 *     providers: [
 *         { provide: STORE_PREFIX, useValue: 'your_prefix' }
 *     ]
 * })
 * export class AppModule { }
 * ```
 *
 * ```
 * localStoreService.set('key', 'value');
 * localStoreService.get('key');
 * localStoreService.remove('key');
 * ```
 *
 * For local storage use `LocalStoreService` with the same API.
 *
 * @description
 *
 * A wrapper for [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage).
 *
 * `localStorage` works the same ways as {@link SessionStoreService}, except it's persistent across sessions.
 *
 * The keys under which data is stored is automatically prefixed with the prefix set by `STORE_PREFIX`.
 *
 * @stable
 */
@Injectable()
export class LocalStoreService extends StoreService {
    constructor(windowRef: WindowRef, @Inject(STORE_PREFIX) prefix: string) {
        super(getBackend(windowRef, 'local'), prefix);
    }
}

const fallbackStorages = {
    local: {},
    session: {}
};

function getBackend(windowRef: WindowRef, type: 'local' | 'session'): Storage {
    let backend: Storage = windowRef.nativeWindow[type + 'Storage'];

    try {
        backend.setItem('__test', 'data');
        backend.removeItem('__test');
    } catch (e) {
        const storage = fallbackStorages[type];

        // not supported, fallback
        backend = <any>{
            getItem: (key: string) => {
                return storage[key];
            },
            setItem: (key: string, value: any) => {
                storage[key] = value;
            },
            removeItem: (key: string) => {
                delete storage[key];
            }
        };
    }

    return backend;
}
