import { Injectable } from '@angular/core';

/**
 * @whatItDoes Represents a change of page metadata.
 *
 * @description
 *
 * Use `revert()` to revert the change to the original value.
 *
 * @experimental
 */
export interface RevertiblePageChange {
    write(): void;
    revert(): void;
}

class PageTitleChange implements RevertiblePageChange {
    private originalTitle: string;

    constructor(private title: string) {
    }

    write() {
        this.originalTitle = document.title;

        document.title = this.title;
    }

    revert() {
        document.title = this.originalTitle;
    }
}

class PageMetaChange implements RevertiblePageChange {
    private originalContent: string | null;

    constructor(private name: string, private content: string) {
    }

    write() {
        let meta = this.getCurrent();

        if (!meta) {
            this.originalContent = null;
            meta = document.createElement('meta');
            meta.name = this.name;
            meta.content = this.content;
            document.head.appendChild(meta);
        } else {
            this.originalContent = meta.content;

            meta.content = this.content;
        }
    }

    revert() {
        let meta = this.getCurrent();

        if (meta) {
            if (this.originalContent === null) {
                meta.remove();
            } else {
                meta.content = this.originalContent;
            }
        }
    }

    private getCurrent() {
        return <HTMLMetaElement | null>document.head.querySelector(`meta[name=${this.name}]`);
    }
}

/**
 * @whatItDoes Manipulates page metadata (like title and meta tags).
 *
 * @howToUse
 *
 * ```
 * ngOnInit() {
 *     this.changes = [
 *         this.pageService.setTitle('special title'),
 *         this.pageService.setMeta('description', 'some description')
 *     ]
 * }
 *
 * ngOnDestroy() {
 *     this.changes.forEach(c => c.revert())
 * }
 * ```
 *
 * @description
 *
 * You can use this service to change (or add) title and meta tags. Each change is reversible by calling `revert()` function on
 * the object returned from each call to the service. Usually you want to have some base title and meta tags, set them to something
 * different for some page, then revert back to the original state after navigating away from this page.
 *
 * This is done automatically for public pages displayed via {@link PageMatrixComponent}.
 *
 * @experimental
 */
@Injectable()
export class PageService {
    setTitle(title: string): RevertiblePageChange {
        const change = new PageTitleChange(title);
        change.write();

        return change;
    }

    setMeta(name: string, content: string): RevertiblePageChange {
        const change = new PageMetaChange(name, content);
        change.write();

        return change;
    }
}
