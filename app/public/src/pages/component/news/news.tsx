import React from "react"
import { useTranslation } from "react-i18next"
import { useNews } from "./useNews"

import "./news.css"

export default function News() {
  const { newsContent, isLoading } = useNews()
  const { t } = useTranslation()

  return (
    <div className="nes-container news custom-bg">
      <h1>{t("news")}</h1>
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : (
        <div
          className="content nes-container"
          dangerouslySetInnerHTML={{ __html: newsContent }}
        ></div>
      )}
    </div>
  )
}
