import { Injectable, NgZone } from '@angular/core';

/**
 * @whatItDoes Sets interval outside angular zone.
 *
 * @description
 *
 * This is because protractor e2e tests hang when interval is running inside angular zone. This service
 * is downgraded as `$interval` for AngularJS to work around this problem.
 *
 * @stable
 */
@Injectable()
export class TimerService {
    constructor(private zone: NgZone) { }

    // NOTE: Running the interval outside Angular ensures that e2e tests will not hang.
    setIntervalOutsideAngularZone(operation: () => void, frequency: number = 0): any {
        let intervalId: any;

        this.zone.runOutsideAngular(() => {
            intervalId = setInterval(() => {
                this.zone.run(() => operation());
            }, frequency);
        });

        return intervalId;
    }

    setTimeoutOutsideAngularZone(operation: () => void, timeout: number = 0): any {
        let timerId: any;

        this.zone.runOutsideAngular(() => {
            timerId = setTimeout(() => {
                this.zone.run(() => operation());
            }, timeout);
        });

        return timerId;
    }

    clearInterval(intervalId: any) {
        clearInterval(intervalId);
    }

    clearTimeout(timerId: any) {
        clearTimeout(timerId);
    }
}
