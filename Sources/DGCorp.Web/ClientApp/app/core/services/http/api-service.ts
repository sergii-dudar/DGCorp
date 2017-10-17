import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {
    private headers: HttpHeaders;
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');
    }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(url, { headers: this.headers });
    }

    post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(url, JSON.stringify(body), { headers: this.headers });
    }

    put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(url, JSON.stringify(body), { headers: this.headers });
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url, { headers: this.headers });
    }
}
