interface PendoIdentityOptions {
  visitor: { id: string; [key: string]: unknown };
  account?: { id: string; [key: string]: unknown };
}

interface Pendo {
  initialize(options: PendoIdentityOptions): void;
  identify(options: PendoIdentityOptions): void;
  pageLoad(url?: string): void;
  clearSession(): void;
  track(eventName: string, properties?: Record<string, unknown>): void;
}

declare const pendo: Pendo;

interface Window {
  pendo?: Pendo;
}
