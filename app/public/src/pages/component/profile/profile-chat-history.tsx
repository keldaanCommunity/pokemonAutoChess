import React, { useEffect, useState } from "react"
import ChatHistory from "../chat/chat-history";
import { useTranslation } from "react-i18next";
import { IChatV2 } from "../../../../../types";

export function ProfileChatHistory(props: { uid: string }) {
    const { t } = useTranslation();
    const [chatHistory, setChatHistory] = useState<IChatV2[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const pageSize = 30
    const loadHistory = async (uid: string, page: number) => {
        try {
            setLoading(true)

            const response = await fetch(`/chat-history/${uid}?page=${page}&t=${Date.now()}`)
            const data: IChatV2[] = await response.json()
            if (props.uid !== uid) return // ignore response if uid changed in the meantime

            if (data.length < pageSize) {
                setHasMore(false); // No more data to load
            }

            setChatHistory((prevHistory) => [...prevHistory, ...data.filter(h => prevHistory.some(p => p.time == h.time) == false)])
        } catch (error) {
            console.error("Failed to load history:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = async () => {
        if (loading || !hasMore) return
        const skip = chatHistory.length
        const page = Math.floor(skip / pageSize + 1)
        loadHistory(props.uid, page)
    };

    useEffect(() => {
        // reset history on uid change
        setChatHistory([])
        setHasMore(true)
        loadHistory(props.uid, 1) // load last 10 games history
    }, [props.uid])

    return <article className="chat-history">
        <h2>{t("chat_history")}</h2>
        <div>
            {(!chatHistory || chatHistory.length === 0) && (
                <p>{t("no_history_found")}</p>
            )}
            {chatHistory && <ChatHistory messages={chatHistory} />}
            {hasMore && (
                <button onClick={loadMore} className="bubbly green" disabled={loading}>
                    {loading ? t("loading") : t("load_more")}
                </button>
            )}
        </div>
    </article>
}