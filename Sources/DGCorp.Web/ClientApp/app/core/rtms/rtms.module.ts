import { NgModule, ModuleWithProviders } from '@angular/core';

import { RtmsService } from './rtms.service';
import { SockJSService } from './sockjs.service';

@NgModule({
    declarations: [],
    exports: [],
})
export class RtmsModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: RtmsModule,
            providers: [
                SockJSService,
                RtmsService
            ]
        };
    }
}
