import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * @whatItDoes Runs html string through `DomSanitizer.bypassSecurityTrustHtml()`
 *
 * @howToUse
 *
 * ```
 * <div [innerHTML]="content | trustAsHtml"></div>
 * ```
 *
 * @stable
 */
@Pipe({ name: 'trustAsHtml', pure: true })
export class TrustAsHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    public transform(value: string | null | undefined): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value || '');
    }
}
