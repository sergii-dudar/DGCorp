import { Injectable } from '@angular/core';

import { WindowRef } from './window-ref.service';

/**
 * @whatItDoes Abstracts html node dom manipulation.
 *
 * @howToUse
 *
 * ```
 * htmlNode.setCssClass('class', true); // add class
 * htmlNode.setCssClass('class', false); // remove class
 * htmlNode.hasCssClass('class'); // check if html node has class
 *
 * htmlNode.setAttribute('attr', 'val'); // set attribute
 * htmlNode.removeAttribute('attr'); // remove attribute
 * ```
 *
 * @stable
 */
@Injectable()
export class HtmlNode {
    private html: HTMLElement;

    constructor(windowRef: WindowRef) {
        this.html = windowRef.nativeWindow.document.documentElement;
    }

    setCssClass(className: string, add: boolean) {
        if (add) {
            this.html.classList.add(className);
        } else {
            this.html.classList.remove(className);
        }
    }

    hasCssClass(className: string) {
        return this.html.classList.contains(className);
    }

    setAttribute(attr: string, value: string | null) {
        if (value) {
            this.html.setAttribute(attr, value);
        } else {
            this.html.removeAttribute(attr);
        }
    }

    getAttribute(attr: string) {
        return this.html.getAttribute(attr);
    }
}
