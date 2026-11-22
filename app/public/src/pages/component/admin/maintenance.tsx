import { useTranslation } from "react-i18next"
import { MaintenanceOrder } from "../../../../../types/enum/MaintenanceOrder"
import { sendMaintenanceOrder } from "../../../network"

export default function Maintenance() {
  const { t } = useTranslation()
  return (
    <div id="maintenance">
      <div className="actions">
        <button
          className="bubbly red"
          onClick={() => sendMaintenanceOrder(MaintenanceOrder.HEAP_SNAPSHOT)}
        >
          {t("admin_panel.heap_snapshot")}
        </button>
        <button
          className="bubbly blue"
          onClick={() =>
            sendMaintenanceOrder(MaintenanceOrder.FETCH_LEADERBOARDS)
          }
        >
          {t("admin_panel.refresh_leaderboards")}
        </button>
        <button
          className="bubbly blue"
          onClick={() =>
            sendMaintenanceOrder(MaintenanceOrder.FETCH_META_REPORTS)
          }
        >
          {t("admin_panel.refresh_meta_reports")}
        </button>
        <button
          className="bubbly blue"
          onClick={() =>
            sendMaintenanceOrder(MaintenanceOrder.REFRESH_SPRITE_GAP_DATA)
          }
        >
          {t("admin_panel.refresh_sprite_gap_data")}
        </button>
        <button
          className="bubbly blue"
          onClick={() =>
            sendMaintenanceOrder(MaintenanceOrder.REFRESH_TWITCH_STREAMS)
          }
        >
          {t("admin_panel.refresh_twitch_streams")}
        </button>
        <button
          className="bubbly blue"
          onClick={() =>
            sendMaintenanceOrder(MaintenanceOrder.REFRESH_TWITCH_BLACKLIST)
          }
        >
          {t("admin_panel.refresh_twitch_blacklist")}
        </button>
      </div>
    </div>
  )
}
