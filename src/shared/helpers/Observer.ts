export type ObserverHandler = () => void;

export class Observer {
  private subscribers: ObserverHandler[] = [];

  public notify() {
    this.subscribers.forEach(handler => handler());
  }

  public subscribe(handler: ObserverHandler) {
    this.subscribers.push(handler);
    return () => this.unsubscribe(handler);
  }

  private unsubscribe(handler: ObserverHandler) {
    this.subscribers = this.subscribers.filter(fn => fn !== handler);
  }
}
