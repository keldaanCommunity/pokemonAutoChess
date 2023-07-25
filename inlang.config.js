/**
 * @type { import("@inlang/core/config").DefineConfig }
 */
export async function defineConfig(env) {
	const { default: i18nextPlugin } = await env.$import(
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-i18next@3/dist/index.js",
	)

	
	const { default: sdkPlugin } = await env.$import(
		'https://cdn.jsdelivr.net/npm/@inlang/sdk-js-plugin@0.9.0/dist/index.js'
	);

    // recommended to enable linting feature
	const { default: standardLintRules } = await env.$import(
		"https://cdn.jsdelivr.net/npm/@inlang/plugin-standard-lint-rules@3/dist/index.js",
	)

	return {
		referenceLanguage: "en",
		plugins: [
			i18nextPlugin({
				pathPattern: "./app/public/dist/client/locales/{language}/translation.json",
			}),
			sdkPlugin({
				languageNegotiation: {
					strategies: [{ type: 'localStorage' }]
				}
			}),
            standardLintRules()
		],
	}
}