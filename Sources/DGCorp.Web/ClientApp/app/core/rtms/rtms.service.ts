import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as SockJS from 'sockjs-client';

import { RtmsMessage } from './rtms-message';
import { TimerService, WindowRef } from '../browser';
//import { RtmsConfig, AppInfoConfig, UserService, UserUpdateEvent } from '../client-config';
import { Logger } from '../utils';
import { SockJSService } from './sockjs.service';

/**
 * @whatItDoes Allows subscribing to messages from Real-Time Messaging System implemneted by the platform.
 *
 * @howToUse
 * ```
 * let sub = this.rtmsService.messages
 *     .filter(m => m.type === 'PLAYERINBOX_UPDATE')
 *     .subscribe(m => {
 *         this.messageCount = m.payload.newMsgCount;
 *     });
 * ```
 *
 * @description
 *
 * Connection is established automatically when there is first subscriber.
 * Correct parameters are automatically resolved from the server too.
 * Also there is automatic reconnect on the user login.
 *
 * @experimental
 */
@Injectable()
export class RtmsService {
    private messagesEvent: Subject<RtmsMessage>;
    private sock: SockJS.Socket;
    private lastReceivedMessageTime: number;
    private keepAliveIntervalId: any;
    private reconnectCount: number = 0;
    private hadConnectionConflict = false;

    constructor(
        private window: WindowRef,
        //private rtmsConfig: RtmsConfig,
        //private appInfoConfig: AppInfoConfig,
        private timerService: TimerService,
        //private userService: UserService,
        private sockJSService: SockJSService,
        private log: Logger) {
    }

    /**
     * Gets the messages. The connection is established automatically on the first call to this property.
     */
    get messages(): Observable<RtmsMessage> {
        if (!this.messagesEvent) {
            this.messagesEvent = new Subject();
            this.openSocket();

            this.window.nativeWindow.addEventListener('focus', () => {
                if (this.hadConnectionConflict) {
                    this.hadConnectionConflict = false;
                    this.reconnect();
                }
            });

            /*this.userService.events
                .filter(e => e instanceof UserUpdateEvent && e.diff.has('ssoToken'))
                .subscribe(() => this.sendConnectMessage());*/
        }
        return this.messagesEvent;
    }

    private openSocket() {
        this.log.debug(`Opening RTMS socket to: ${this.rtmsConfig.host}`);
        this.sock = this.sockJSService.create(this.rtmsConfig.host);

        this.sock.onopen = () => this.onOpen();
        this.sock.onmessage = (e: any) => this.onMessage(e);
        (this.sock as any).onerror = (e: any) => this.onError(e); // temp solution, as it is not defined in typings
        this.sock.onclose = (e: any) => this.onClose(e);
    }

    private sendToSocket(method: string, params: any) {
        this.sock.send(JSON.stringify({ method, params }));
    }

    private onOpen() {
        this.log.debug('RTMS connection is opened, sending connect message.');
        this.sendConnectMessage();
    }

    private sendConnectMessage() {
        const params: any = {
            /*brand: this.appInfoConfig.brandId,
            frontend: this.appInfoConfig.frontendId,
            product: this.appInfoConfig.productId,
            channel: this.appInfoConfig.channelId*/
        };

        /*if (this.userService.isAuthenticated) {
            params.user = this.userService.id;
            params.sso = this.userService.ssoToken;
        }*/
        this.sendToSocket('connect', params);
    }

    private onMessage(e: MessageEvent) {
        this.lastReceivedMessageTime = Date.now();
        const msg = JSON.parse(e.data || 'null');

        switch (msg && msg['method']) {
            case 'connect':
                this.reconnectCount = 0;
                this.log.debug(`RTMS connected with sessionId="${msg.params && msg.params.session}".`);
                this.startKeepAliveInterval();
                break;
            case 'notify':
                this.log.debug(`RTMS message arrived with params: ${JSON.stringify(msg.params)}.`);
                this.messagesEvent.next(msg.params);
                break;
            case 'ping':
                const latency = Date.now() - (msg.params as PingMessage).timestamp;
                this.log.debug(`RTMS ping arrived with latency ${latency} milliseconds.`);
                break;
            default:
                this.log.error(`RTMS received unknown message: ${e.data}.`);
                break;
        }
    }

    private onError(e: any) {
        this.log.error(`RTMS connection error occurred: ${JSON.stringify(e)}.`);
    }

    private onClose(e: CloseEvent) {
        this.log.debug(`RTMS connection closed. Code=${e.code}, Reason="${e.reason}".`);
        this.stopKeepAliveInterval();

        // 4000 - Timeout waiting for Connect.
        // 4001 - Invalid Message received from client
        // 4002 - Missing or invalid Connect Parameters
        // 4003 - Authentication failure
        // 4004 - Login on another connection

        if (e.code <= 4000) {
            let timeout = this.reconnectCount > 10 ? 10000 : 1000;
            this.log.debug(`Will reconnect in ${timeout} milliseconds.`);
            this.timerService.setTimeoutOutsideAngularZone(() => this.reconnect(), timeout);
        } else if (e.code === 4004) {
            this.hadConnectionConflict = true;
            this.log.debug(`Connection with same parameters was opened in different window. This one will reconnect once this window is focused.`);
        } else {
            this.log.error(`Staying disconnected because error ${e.code} (${e.reason}) is critical. Needs to be fixed on the server.`);
        }
    }

    private reconnect() {
        this.log.debug(`Attempting to reconnect.`);
        this.reconnectCount++;
        this.openSocket();
    }

    private startKeepAliveInterval() {
        this.stopKeepAliveInterval();

        if (this.rtmsConfig.keepAliveMilliseconds > 0) {
            // So that we don't get confusing delays with long configured interval
            const frequency = Math.min(1000, this.rtmsConfig.keepAliveMilliseconds);
            this.keepAliveIntervalId = this.timerService.setIntervalOutsideAngularZone(() => this.onKeepAlive(), frequency);
        }
    }

    private stopKeepAliveInterval() {
        if (this.keepAliveIntervalId) {
            this.timerService.clearInterval(this.keepAliveIntervalId);
            this.keepAliveIntervalId = null;
        }
    }

    private onKeepAlive() {
        const elapsed = Date.now() - this.lastReceivedMessageTime;
        if (elapsed >= this.rtmsConfig.reconnectMilliseconds) {
            this.log.debug(`RTMS connection is inactive for ${elapsed} milliseconds which is very long therefore closing the connection. Reconnect should follow.`);
            this.sock.close();
        } else if (elapsed >= this.rtmsConfig.keepAliveMilliseconds) {
            this.log.debug(`RTMS connection is inactive for ${elapsed} milliseconds therefore sending a ping.`);
            this.sendToSocket('ping', new PingMessage());
        }
    }
}

class PingMessage {
    timestamp: number = Date.now();
}
