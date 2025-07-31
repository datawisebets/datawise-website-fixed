declare module 'tiny-emitter' {
  export default class Emitter {
    on(event: string, callback: (...args: any[]) => void): Emitter;
    once(event: string, callback: (...args: any[]) => void): Emitter;
    emit(event: string, ...args: any[]): Emitter;
    off(event: string, callback?: (...args: any[]) => void): Emitter;
  }
}