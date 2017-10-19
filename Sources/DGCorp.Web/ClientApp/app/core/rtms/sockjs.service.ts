import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';

/**
 * @whatItDoes Wraps creation of SockJS websocket for easier unit testing.
 */
@Injectable()
export class SockJSService {
    create(url: string): SockJS.Socket {
        return new SockJS(url);
    }
}
