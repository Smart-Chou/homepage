/// <reference types="astro/client" />

interface Window {
  MSInputMethodContext?: unknown;
  __STATE__: {
    imgLoadStatus: boolean;
    innerWidth: number;
    coverType: string;
    siteStartShow: boolean;
    backgroundShow: boolean;
    boxOpenState: boolean;
    mobileOpenState: boolean;
    mobileFuncState: boolean;
    setOpenState: boolean;
    footerBlur: boolean;
  };
  saveState(key: string, value: unknown): void;
  notify(eventName: string, detail?: unknown): void;
  setInnerWidth(value: number): void;
  showToast(msg: string | { message?: string; duration?: number }, duration?: number): void;
}

interface Document {
  documentMode?: number;
}
