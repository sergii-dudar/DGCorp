import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {AppRoutes} from './pages/app.routes';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {PagesModule} from './pages/pages.module';
import {CoreModule} from './core/core.module';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        AppRoutes,
        BrowserModule,
        PagesModule.forRoot(),
        CoreModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
