import { Injectable } from '@angular/core';

@Injectable()
export class CoreConfiguration {
    public Server = 'http://localhost:93/api';
    public getActionUri(controller: string, action?: string){
        return action ? `${this.Server}/${controller}/${action}` : `${this.Server}/${controller}`;
    }
}
