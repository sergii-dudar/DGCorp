import {ModuleWithProviders, NgModule} from '@angular/core';

import {AppRoutes} from './app.routes';
import {HomeComponent} from './home';
import {FetchDataComponent} from './fetchdata';
import {CounterComponent} from './counter';
import {NavMenuComponent} from './navmenu';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

const pagesModules = [
    NavMenuComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppRoutes,
        BrowserModule
    ],
    exports: pagesModules,
    declarations: pagesModules,
    entryComponents: pagesModules
})
export class PagesModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: PagesModule
        };
    }
}
