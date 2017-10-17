import {ModuleWithProviders, NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

const gamesModules: any[] = [
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserModule
    ],
    exports: gamesModules,
    declarations: gamesModules,
    entryComponents: gamesModules
})
export class GamesModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: GamesModule,
            providers: [
            ]
        };
    }
}

