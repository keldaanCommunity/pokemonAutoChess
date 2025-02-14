import dotenv from "dotenv"
import { FormatType } from "pastebin-ts"
import { PastebinAPI } from "pastebin-ts/dist/api"
let pastebin: PastebinAPI | undefined

function getPastebin() {
  if (pastebin) return pastebin

  dotenv.config()
  if (
    process.env.PASTEBIN_API_DEV_KEY &&
    process.env.PASTEBIN_API_USERNAME &&
    process.env.PASTEBIN_API_DEV_KEY
  ) {
    return (pastebin = new PastebinAPI({
      api_dev_key: process.env.PASTEBIN_API_DEV_KEY!,
      api_user_name: process.env.PASTEBIN_API_USERNAME!,
      api_user_password: process.env.PASTEBIN_API_PASSWORD!
    }))
  } else {
    throw new Error(
      "Pastebin not configured; set PASTEBIN_API_USERNAME and PASTEBIN_API_DEV_KEY env variables"
    )
  }
}

export const pastebinService = {
  async createPaste(title: string, text: string, format: FormatType = "json") {
    return getPastebin().createPaste({
      text,
      title,
      format
    })
  },

  getPaste(id: string, raw: boolean) {
    return getPastebin().getPaste(id, raw)
  }
}
