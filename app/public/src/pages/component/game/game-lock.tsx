import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { lockShop } from "../../../network"

export default function GameLock() {
  const { t } = useTranslation()
  const shopLocked = useAppSelector((state) => state.game.shopLocked)

  return (
    <button
      className={`bubbly lock-icon ${shopLocked ? "red" : "green"}`}
      onClick={() => lockShop()}
      title={`${shopLocked ? t("shop.unlock") : t("shop.lock")} ${t(
        "shop.current_shop_for_next_turn"
      )}`}
    >
      <img src={`/assets/ui/lock-${shopLocked ? "close" : "open"}.svg`} />
      <span style={{ fontWeight: "600" }}>
        {shopLocked ? t("shop.unlock") : t("shop.lock")}
      </span>
    </button>
  )
}
