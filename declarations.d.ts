declare module "whatsapp-web.js" {
  export class Client {
    constructor(options?: any);
    on(event: string, callback: (...args: any[]) => void): void;
    initialize(): Promise<void>;
    sendMessage(chatId: string, message: string): Promise<any>;
  }
  export class LocalAuth {
    constructor(options?: any);
  }
}

declare module "qrcode" {
  const qrcode: any;
  export default qrcode;
}
