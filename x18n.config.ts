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
  ignoreKeys: ['translation:shop.clicks_one', 'translation:ability_description.DEFAULT'],
  checks: { 'stale-translation': 'off', 'missing-translation': 'off' },
  history: false,
  resources: [{ pattern: 'app/public/dist/client/locales/{locale}/{namespace}.json' }],
  usage: {
    include: ['app/public/src/**/*', 'app/core/expeditions.ts', 'app/types/strings/Strings.ts'],
    // Keys built at runtime, which the scanner cannot see
    keysInUse: [
      // t(`passive_description.${pokemon.passive}`)
      'translation:passive_description.*',
      // t(`${ROW_KEY}.xxx`) in replay-event-format.ts
      'translation:replay.eventlog.row.*',
      // keys stored in lookup maps in replay-event-log.tsx and replay-event-format.ts, then passed to t()
      'translation:replay.eventlog.cat.*',
      'translation:replay.eventlog.phase.*',
      'translation:replay.eventlog.section.*',
      'translation:replay.eventlog.sub.*',
      // DisplayText values rendered with t(message.text)
      'translation:already_held',
      'translation:bark',
      'translation:belly_full',
      'translation:fully_grown',
      'translation:not_hungry',
      // t(pveStage.name) in wiki-stages.tsx
      'translation:tower_duo',
      'translation:legendary_birds',
      'translation:legendary_beasts',
      'translation:legendary_giants',
      'translation:super_ancients'
    ]
  }
})
