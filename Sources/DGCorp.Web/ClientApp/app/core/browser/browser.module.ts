import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieService as BaseCookieService, CookieOptions } from 'ngx-cookie';
import { COOKIE_OPTIONS, CookieOptionsProvider } from 'ngx-cookie/src/cookie-options-provider';

import { WindowRef } from './window-ref.service';
import { HtmlNode } from './html-node.service';
import { TimerService } from './timer.service';
import { LocalStoreService, SessionStoreService } from './store.service';
import { TrustAsHtmlPipe } from './trust-as-html.pipe';
import { HtmlAttrsDirective } from './html-attrs.directive';
import { CookieService } from './cookie.service';
import { FocusScrollDirective } from './focus-scroll.directive';
import { DeviceService } from './device.service';
import { PageService } from './page.service';

@NgModule({
    declarations: [TrustAsHtmlPipe, HtmlAttrsDirective, FocusScrollDirective],
    exports: [TrustAsHtmlPipe, HtmlAttrsDirective, FocusScrollDirective]
})
export class BrowserModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: BrowserModule,
            providers: [
                WindowRef,
                HtmlNode,
                TimerService,
                LocalStoreService,
                SessionStoreService,
                DeviceService,
                { provide: COOKIE_OPTIONS, useFactory: cookieOptionsFactory },
                CookieOptionsProvider,
                BaseCookieService,
                CookieService,
                PageService
            ]
        };
    }
}

export function cookieOptionsFactory(): CookieOptions {
    const domain = document.documentElement.getAttribute('data-domain')!;

    return { path: '/', domain: domain };
}
