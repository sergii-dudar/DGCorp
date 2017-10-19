/**
 * @whatItDoes Identifies log type for simple remote log messages. See {@link RemoteLogger}.
 *
 * @experimental
 */
export class LogType {
    static Error = 'Error';
    static Warning = 'Warn';
    static Info = 'Info';
}

class RemoteLogData {
    time: number;
    message: string;
    name: string;
    description: string;
    stack: string;
    stacktrace: string;
    sourceURL: string;
    line: number;
    number: number;
    lineNumber: number;
    columnNumber: string;
    fileName: string;
    arguments: string;
    source: string;
    type: string;

    static fromArgs(message: string, type: any) {
        const data = new RemoteLogData();

        data.time = Date.now();
        data.message = message;
        data.type = type;

        return data;
    }

    static fromError(error: any) {
        const data = new RemoteLogData();

        data.time = Date.now();
        data.message = error.message;
        if (typeof error === 'string') {
            data.message = error;
        }

        data.name = error.name;
        data.description = error.description;
        data.stack = error.stack;
        data.stacktrace = error.stacktrace;
        data.sourceURL = error.sourceURL;
        data.line = error.line;
        data.number = error.number;
        data.lineNumber = error.lineNumber;
        data.columnNumber = error.columnNumber;
        data.fileName = error.fileName;

        if (error.arguments instanceof Array) {
            data.arguments = error.arguments.toString();
        } else {
            data.arguments = error.arguments;
        }

        if (typeof error.toSource === 'function') {
            data.source = error.toSource();
        }

        return data;
    }
}

/**
 * @whatItDoes Logs errors or messages to the server via api.
 *
 * @experimental
 */
export class RemoteLogger {
    private queue: RemoteLogData[] = [];
    private timer: any;

    constructor(private url: string = '/log', private pollInterval: number = 2000) { }

    /**
     * Logs an `Error` like object to the server. This is used by global error handlers.
     */
    logError(error: any) {
        this.queue.push(RemoteLogData.fromError(error));
        this.sendLogs();
    }

    /**
     * Logs a message to the server. Supported types are {@link LogType}.
     */
    log(message: string, type: string) {
        this.queue.push(RemoteLogData.fromArgs(message, type));
        this.sendLogs();
    }

    private sendLogs() {
        if (this.timer) {
            return;
        }

        this.timer = setTimeout(() => {
            let errors = JSON.stringify(this.queue);

            fetch(this.url, {
                method: 'POST',
                body: errors,
                headers: {
                    'content-type': 'application/json'
                }
            }).catch(() => {
                alert('Your internet connection seems to be off. Refresh the page when its on again.');
            }).then(() => {
                this.timer = null;
            });

            this.queue = [];
        }, this.pollInterval);
    }
}

/**
 * Instance of {@link RemoteLogger} with default parameters usable outside of angular.
 *
 * @experimental
 */
export const defaultRemoteLogger = new RemoteLogger();
