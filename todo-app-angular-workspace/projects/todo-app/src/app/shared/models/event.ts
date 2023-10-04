export interface Event<T = EventTarget | null> {
  target: T | null;
}