
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { CONTENT_AS_HTML, markdownToConfig } from "markdown-to-config"
import DiscordButton from "../buttons/discord-button"
import { cc } from "../../utils/jsx"
import "./servers-list.css"

interface ServerInfo {
    name: string
    url: string
    logo: string
    creator: string
    version: string
    discord: string
    location: string
    description: string
}

interface ServerStatus {
    status: string
    ccu: number
    maxCcu: number
    version: string
    ping: string
}

export default function ServersList() {
    const { t } = useTranslation()
    const [servers, setServers] = useState<ServerInfo[]>([])
    useEffect(() => {
        const url = "https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/master/community-servers.md"
        fetch(url).then(res => res.text()).then(md => markdownToConfig(md)).then(config => {
            setServers((Object.entries(config) as [string, ServerInfo][]).map(([name, server]) => {
                return {
                    name,
                    url: server.url,
                    logo: server.logo ?? "https://pokemon-auto-chess.com/assets/ui/pokemon_autochess_final.svg",
                    creator: server.creator,
                    version: server.version,
                    discord: server.discord,
                    location: server.location,
                    description: server[CONTENT_AS_HTML]
                }
            }))
        })
    }, [])
    return (
        <div id="servers-list">
            {servers.length === 0 && <p>{t("loading")}</p>}
            <ul>
                {servers.map((server) => (
                    <ServerInfo key={server.name} server={server} />
                ))}
            </ul>
        </div >
    )
}

export function ServerInfo(props: { server: ServerInfo }) {
    const { t } = useTranslation()
    const server = props.server
    const isCurrentServer = server.url?.startsWith(window.location.origin)
    const [serverStatus, setServerStatus] = useState<ServerStatus>({ status: "checking...", ccu: 0, maxCcu: 0, version: "unknown", ping: "" })
    useEffect(() => {
        if (!server.url) {
            setServerStatus({ status: "unknown", ccu: 0, maxCcu: 0, version: "unknown", ping: "" })
            return
        }
        const url = server.url + "/status"
        const t = performance.now()
        fetch(url, { signal: AbortSignal.timeout(5000) })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    throw new Error(res.statusText)
                }
            })
            .then(serverStatus => {
                const ping = Math.round(performance.now() - t)
                setServerStatus({ status: "online", ping: `${ping}ms`, ...serverStatus })
            })
            .catch(error => {
                if (error.name === "TimeoutError") {
                    setServerStatus({ status: "offline", ccu: 0, maxCcu: 0, version: "unknown", ping: "" })
                } else {
                    setServerStatus({ status: error.message || "unknown", ccu: 0, maxCcu: 0, version: "unknown", ping: "" })
                }

            })
    }, [server.url])

    return <li className={cc("server my-box", { current: isCurrentServer })} >
        <header>
            <img className="logo" src={server.logo} alt={server.name} />
            <h2>{server.name}{server.url && <> - <a href={server.url}>{server.url}</a></>}</h2>
            {!isCurrentServer && <a className="bubbly blue" href={server.url}>{t("switch_server")}</a>}
            {server.discord && <DiscordButton url={server.discord} />}
        </header>
        <dl>
            <dt>{t("creator")}</dt>
            <dd>{server.creator}</dd>
            <dt>{t("location")}</dt>
            <dd>{server.location}</dd>
            <dt>{t("status_label")}</dt>
            <dd className={"status-" + serverStatus.status}>{serverStatus.status}</dd>
            {serverStatus.status === "online" && <>
                <dt>{t("version")}</dt>
                <dd>{serverStatus.version}</dd>
                <dt>{t("players")}</dt>
                <dd>{serverStatus.ccu}/{serverStatus.maxCcu}</dd>
                <dt>{t("ping")}</dt>
                <dd>{serverStatus.ping}</dd>
            </>}
        </dl>
        <div dangerouslySetInnerHTML={{ __html: server.description }} className="description" />
    </li>
}