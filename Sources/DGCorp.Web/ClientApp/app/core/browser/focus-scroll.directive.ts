import { Directive, Input, ElementRef } from '@angular/core';

import { WindowRef } from './window-ref.service';

/**
 * @whatItDoes When truthy value is on input, it enables scroll for the element and disables scroll on the document.
 *
 * @stable
 */
@Directive({
    selector: '[vnFocusScroll]'
})
export class FocusScrollDirective {
    @Input() set vnFocusScroll(value: boolean) {
        this.update(value);
    }

    private element: HTMLElement;
    private scrollPosY: number;
    private touchMoveHandler: EventListener;
    private touchStartHandler: EventListener;

    constructor(elementRef: ElementRef, private windowRef: WindowRef) {
        this.element = elementRef.nativeElement;
    }

    private update(value: boolean) {
        if (value) {
            this.disableNativePageScrolling();
            this.enableElementScrolling();
        } else {
            this.scrollElementTop();
            this.enableNativePageScrolling();
            this.disableMenuScrolling();
        }
    }

    private disableNativePageScrolling() {
        this.windowRef.nativeWindow.document.addEventListener('touchmove', this.noopHandler, false);
    }

    private enableNativePageScrolling() {
        this.windowRef.nativeWindow.document.removeEventListener('touchmove', this.noopHandler, false);
    }

    private enableElementScrolling() {
        if (this.element) {
            this.touchStartHandler = this.snapshotYPos.bind(this);
            this.touchMoveHandler = this.scrollElementHandler.bind(this);

            this.element.addEventListener('touchstart', this.touchStartHandler, false);
            this.element.addEventListener('touchmove', this.touchMoveHandler, false);
        }
    }

    private disableMenuScrolling() {
        if (this.element) {
            this.element.removeEventListener('touchstart', this.touchStartHandler, false);
            this.element.removeEventListener('touchmove', this.touchMoveHandler, false);
        }
    }

    private noopHandler(event: Event) {
        event.preventDefault();
    }

    private snapshotYPos(event: TouchEvent) {
        this.scrollPosY = event.touches[0].clientY;
    }

    private scrollElementHandler(event: TouchEvent) {
        const currentY = event.touches[0].clientY;
        const distance = this.scrollPosY - currentY;
        this.scrollPosY = currentY;
        this.element.scrollTop += distance;

        event.preventDefault();
    }

    private scrollElementTop() {
        if (this.element) {
            this.element.scrollTop = 0;
        }
    }
}
