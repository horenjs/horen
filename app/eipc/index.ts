import 'reflect-metadata';
import type { WebContents } from 'electron';
import { ipcMain } from 'electron';

export type Construct<T = any> = new (...args: Array<any>) => T;

const EPIC_INVOKE = Symbol('ipc-invoke');
const EPIC_ON = Symbol('ipc-on');

/**
 * use experimental decorator to handle ipc event.
 */
export default class Eipc {
  private injects = {};

  constructor(
    private webContents: WebContents,
    private channels: { [key: string]: string },
    private handlers: Construct[] = [],
  ) {
    // to load all hanlders
  }

  /**
   * bootstrop the handlers.
   */
  async init() {
    for (const HandlerClass of this.handlers) {
      const handler = this.factory(HandlerClass);
      const proto = HandlerClass.prototype;

      const funcs = Object.getOwnPropertyNames(proto).filter(item => {
        return typeof handler[item] === 'function' && item !== 'constructor';
      });

      funcs.forEach(funcName => {
        let evt: string | null = null;
        evt = Reflect.getMetadata(EPIC_INVOKE, proto, funcName);
        if (evt) {
          ipcMain.handle(evt, async (e, ...args) => {
            try {
              const result = await handler[funcName].call(handler, ...args);
              return { data: result }
            } catch (err) {
              return { err }
            }
          })
        } else {
          evt = Reflect.getMetadata(EPIC_ON, proto, funcName);
          if (!evt) return;

          const func = handler[funcName];
          handler[funcName] = async (...args: any[]) => {
            const result = await func.call(handler, ...args);
            this.webContents.send(evt as string, result);
            return result;
          }
        }
      })
    }
  }

  /**
   * initialize the handler class
   * @param constructor Handler Class
   * @returns the handler instance
   */
  factory<T>(constructor: Construct<T>): T {
    const paramtypes = Reflect.getMetadata('design:paramtypes', constructor);

    const providers = paramtypes.map((provider: Construct<T>) => {
      const name = Reflect.getMetadata('name', provider);
      const item = this.injects[name] || this.factory(provider);
      this.injects[name] = item;
      return item;
    });

    return new constructor(...providers);
  }

  /**
   * destory all ipc handlers.
   */
  destory() {
    for (const channel in this.channels) {
      ipcMain.removeHandler(this.channels[channel]);
    }

    for (const inject in this.injects) {
      this.injects[inject].destory && this.injects[inject].destory();
    }
  }

  /**
   * Ipc Invoke Decorator
   * @param channel ipc channel
   * @returns function
   */
  static Invoke(channel: string): MethodDecorator {
    return (target: any, propertyName: string | symbol) => {
      Reflect.defineMetadata(EPIC_INVOKE, channel, target, propertyName);
    }
  }

  /**
   * Ipc On Decorator
   * @param channel ipc channel
   * @returns function
   */
  static On(channel: string): MethodDecorator {
    return (target: any, propertyName: string | symbol) => {
      Reflect.defineMetadata(EPIC_ON, channel, target, propertyName);
    }
  }

  /**
   * Handler Decorator
   * @returns function
   */
  static Handler(): ClassDecorator {
    return (_: object) => {
      // do nothing
    }
  }

  /**
   * Inject Decorator
   * @param name service name
   * @returns function
   */
  static Injectable(name: string): ClassDecorator {
    return (target: object) => {
      Reflect.defineMetadata('name', name, target);
    }
  }
}
