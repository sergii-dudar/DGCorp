import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home';
import {CounterComponent} from './counter';
import {FetchDataComponent} from './fetchdata';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'counter', component: CounterComponent },
    { path: 'fetch-data', component: FetchDataComponent },
    { path: '**', redirectTo: 'home' }
];

export const AppRoutes = RouterModule.forRoot(routes);
