declare module 'https-proxy-agent' {
    import { Agent } from 'http';
    interface HttpsProxyAgentOptions {
        host?: string;
        port?: number | string;
        secureProxy?: boolean;
        headers?: Record<string, string>;
        proxyAuth?: string;
        protocol?: string;
    }
    export default class HttpsProxyAgent extends Agent {
        constructor(opts: string | HttpsProxyAgentOptions);
    }
}
