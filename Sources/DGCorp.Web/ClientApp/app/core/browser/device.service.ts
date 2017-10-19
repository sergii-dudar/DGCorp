import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { WindowRef } from './window-ref.service';

/**
 * @whatItDoes Provides information about current device
 *
 * @description
 *
 * Use to check device type and orientation.
 *
 * @stable
 */
@Injectable()
export class DeviceService {
    private orientationEvents: BehaviorSubject<string>;
    private query: MediaQueryList;

    get orientation(): Observable<string> { return this.orientationEvents; }
    get currentOrientation(): string { return this.orientationEvents.value; }

    constructor(private windowRef: WindowRef) {
        this.query = windowRef.nativeWindow.matchMedia('(orientation: landscape)');

        this.orientationEvents = new BehaviorSubject(this.getOrientation());

        this.query.addListener(() => this.onOrientationChange());
    }

    isiOS() {
        return /(iPad|iPhone|iPod)/g.test(this.windowRef.nativeWindow.navigator.userAgent);
    }

    isChrome() {
        return /Chrome/g.test(this.windowRef.nativeWindow.navigator.userAgent);
    }

    isNexus() {
        return /Nexus/g.test(this.windowRef.nativeWindow.navigator.userAgent);
    }

    private onOrientationChange() {
        const newOrientation = this.getOrientation();
        if (newOrientation !== this.currentOrientation) {
            this.orientationEvents.next(newOrientation);
        }
    }

    private getOrientation() {
        return this.query.matches ? 'landscape' : 'portrait';
    }
}
