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
            allowFullScreen
          ></iframe>
          <h3>Official Trailer</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/wEOipl5L7A8"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h3>A beginner's guide to Pokemon Auto-chess</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/Zep0Tk7xMVs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h3>How to position your units</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/VK-wTKsQ108"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h3>How to manage your economy</h3>
        </li>
        <li className="my-box">
          <iframe
            src="https://www.youtube.com/embed/4IPNEnEbvdE"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h3>101 Tips and Tricks for Becoming a Pro</h3>
        </li>
      </ul>
      <p>
        {t("thanks_to")}&nbsp;
        <a href="https://www.youtube.com/@PokePlagued" target="_blank">
          Plagued
        </a>
        {", "}
        <a href="https://www.youtube.com/@batotsu2751" target="_blank">
          Batotsu
        </a>
        {", "}
        <a href="https://www.youtube.com/@demonhornstv" target="_blank">
          DemonhornsTV
        </a>
        {", "}
        <a href="https://www.youtube.com/@Azmo_PAC" target="_blank">
          Azmo
        </a>{" "}
        {", "}
        <a href="https://www.youtube.com/@biggerweff" target="_blank">
          Bigweff
        </a>{" "}
        {t("tutorial_work")}
      </p>
    </div>
  )
}
