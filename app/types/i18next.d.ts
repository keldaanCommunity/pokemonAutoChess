import locales from "./locales"

declare module 'i18next' {
    interface CustomTypeOptions {
      resources: typeof locales;
    }
  }