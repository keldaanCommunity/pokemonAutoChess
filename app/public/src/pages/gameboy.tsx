import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"

export function Gameboy() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    function cleanupFrame() {
        const frame = document.querySelector("#pokechess_iframe") as HTMLIFrameElement;
        if (!frame || !frame.contentDocument) return;
        const new_style_element = document.createElement("style");
        new_style_element.textContent = "body { background-color: transparent; }";
        frame.contentDocument.head.appendChild(new_style_element);
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <MainSidebar
                page="main_lobby"
                leave={() => navigate("/lobby")}
                leaveLabel={t("back_to_lobby")}
            />
            <div style={{ height: "100%", paddingLeft: "calc(var(--sidebar-width) + 10px)" }}>
                <iframe id="pokechess_iframe" src="/pokechess/" style={{ height: "1400px", minWidth: "1400px", width: "100%", border: "none" }} onLoad={cleanupFrame} />
            </div>
        </div >
    )
}
