/// <reference types="astro/client" />

interface Window {
  MSInputMethodContext?: unknown;
  __STATE__: {
    imgLoadStatus: boolean;
    innerWidth: number;
    backgroundShow: boolean;
  };
  saveState(key: string, value: unknown): void;
  notify(eventName: string, detail?: unknown): void;
  setInnerWidth(value: number): void;
  showToast(msg: string | { message?: string; duration?: number }, duration?: number): void;
}

interface Document {
  documentMode?: number;
}
