import { defineConfig } from '@x18n/core'

// Detected presets: react-i18next, i18next. They apply automatically.
export default defineConfig({
  sourceLocale: 'en',
  locales: [
    'en',
    'fr',
    'pt',
    'de',
    'es',
    'it',
    'ja',
    'nl',
    'bg',
    'ko',
    'pl',
    'vi',
    'th',
    'zh',
    'tr'
  ],
  // Chinese has no singular form, so zh intentionally omits {{count}} here
  ignoreKeys: ['translation:shop.clicks_one'],
  resources: [{ pattern: 'app/public/dist/client/locales/{locale}/{namespace}.json' }],
  usage: {
    include: ['app/public/src/**/*', 'app/core/expeditions.ts', 'app/types/strings/Strings.ts']
  }
})
