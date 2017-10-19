/**
 * @whatItDoes Defines the format of a message returned by RTMS though web-socket.
 *
 * @experimental
 */
export interface RtmsMessage {
    readonly payload: any;
    readonly type: string;
}
