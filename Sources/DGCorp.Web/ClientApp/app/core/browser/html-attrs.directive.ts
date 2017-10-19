import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

/**
 * @whatItDoes Dynamically sets html attributes on an element
 *
 * @howToUse
 *
 * ```
 * <div [vnHtmlAttrs]="collectionWithAttributes"></div>
 * ```
 *
 * If `collectionWithAttributes` is `{'class':'foo','title':'Hello', 'id': 'new_id'}` the resulting html will be
 *
 * ```
 * <div class="foo" id="new_id" title="Hello"></div>
 * ```
 *
 * @description
 *
 * Used internally to set attributes on an element rendered from sitecore, that has dictionary of
 * arbitrary html attributes. You can also use this yourself, but there will not be many use cases for it (if any at all).
 *
 * It updates the attributes when the input object changes.
 *
 * NOTE: It does not do any compilation, so bindings will not work.
 *
 * @stable
 */
@Directive({
    selector: '[vnHtmlAttrs]'
})
export class HtmlAttrsDirective implements OnChanges {
    @Input() vnHtmlAttrs: any;
    private snapshot: Map<string, string>;
    private addedClasses: string[];
    private element: HTMLElement;

    constructor(elementRef: ElementRef) {
        this.element = elementRef.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        let attrs = changes['vnHtmlAttrs'];

        if (attrs) {
            this.renderAttributes(attrs.currentValue, attrs.previousValue);
        }
    }

    private renderAttributes(newValues: { [attr: string]: string }, oldValues: { [attr: string]: string }) {
        if (this.snapshot) {
            this.addedClasses.forEach(c => this.element.classList.remove(c));

            Object.keys(oldValues || []).forEach(key => {
                if (this.snapshot.has(key)) {
                    if (oldValues[key] === this.element.getAttribute(key)) {
                        this.element.setAttribute(key, this.snapshot.get(key)!);
                    }
                } else if (!this.isClass(key)) {
                    this.element.removeAttribute(key);
                }
            });
        }

        this.snapshot = new Map<string, string>();
        this.addedClasses = [];

        Object.keys(newValues || []).forEach(key => {
            const value = newValues[key];
            if (this.isClass(key)) {
                this.addedClasses.push(value);

                this.element.classList.add(value);
            } else {
                const attrValue = this.element.getAttribute(key);
                if (attrValue) {
                    this.snapshot.set(key, attrValue);
                }

                this.element.setAttribute(key, value);
            }
        });
    }

    private isClass(name: string) {
        return name.toLowerCase() === 'class';
    }
}
