import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutes} from './app.routes';
import {HomeComponent} from './home/home.component';
import {FetchDataComponent} from './fetchdata/fetchdata.component';
import {CounterComponent} from './counter/counter.component';
import {NavMenuComponent} from './navmenu/navmenu.component';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppRoutes,
        BrowserModule
    ],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }


export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

