import { FormatType } from "pastebin-ts"
import { PastebinAPI } from "pastebin-ts/dist/api"

let pastebinApi: PastebinAPI | undefined

if (
  process.env.PASTEBIN_API_DEV_KEY &&
  process.env.PASTEBIN_API_USERNAME &&
  process.env.PASTEBIN_API_DEV_KEY
) {
  pastebinApi = new PastebinAPI({
    api_dev_key: process.env.PASTEBIN_API_DEV_KEY!,
    api_user_name: process.env.PASTEBIN_API_USERNAME!,
    api_user_password: process.env.PASTEBIN_API_PASSWORD!
  })
}

export const pastebinService = {
  createPaste(title: string, text: string, format: FormatType = "json") {
    return pastebinApi?.createPaste({
      text,
      title,
      format
    })
  },

  getPaste(id: string, raw: boolean) {
    return pastebinApi?.getPaste(id, raw)
  }
}
