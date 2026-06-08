interface Pendo {
  track(eventName: string, properties?: Record<string, unknown>): void;
}

declare const pendo: Pendo;

interface Window {
  pendo?: Pendo;
}
