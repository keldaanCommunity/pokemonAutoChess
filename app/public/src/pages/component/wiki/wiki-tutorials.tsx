import React from "react"
import { useTranslation } from "react-i18next"

export default function WikiTutorials() {
  const { t } = useTranslation()
  return (
    <div className="wiki-tutorials">
      <ul>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/3LJbX2v6ba8"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <h3>Official Trailer</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/wU8tzabmvJo"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <h3>Learn the basics</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/UjV2TkGYIuM"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <h3>5 Tips for Pokemon Auto Chess</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/1Zpvc6IlzKA"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <h3>How to position your units</h3>
        </li>

      </ul>
      <p>
        {t("thanks_to")}&nbsp;
        <a href="https://www.youtube.com/ProperGoodGames" target="_blank">
          ProperGoodGames
        </a>{", "}
        <a href="https://www.youtube.com/@PokePlagued" target="_blank">
          Plagued
        </a>{", "}
        <a href="https://www.youtube.com/@batotsu2751" target="_blank">
          Batotsu
        </a>{", "}
        <a href="https://www.youtube.com/@ggillou1778" target="_blank">
          JMT
        </a>{" "}
        {t("tutorial_work")}
      </p>
    </div>
  )
}
