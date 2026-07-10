import { useTranslation } from "react-i18next"
import { Item } from "../../../../../types/enum/Item"
import { ItemDetailTooltip } from "../../../game/components/item-detail"


export default function WikiDoubleUp() {
  const { t } = useTranslation()
  return (
    <div className="wiki-double-up">
      <section className="my-box">
        <h2>1. Shared HP Pool</h2>
        <p>{t("wiki.double_up.shared_hp")}</p>
      </section>

      <section className="my-box">
        <h2>2. Croagunk Trading System</h2>
        <p>{t("wiki.double_up.trade_desc")}</p>
        <div className="double-up-tradable-items">
          {[
            Item.CHARCOAL,
            Item.MAGNET,
            Item.TWISTED_SPOON,
            Item.MYSTIC_WATER,
            Item.BLACK_GLASSES,
            Item.MIRACLE_SEED,
            Item.HEART_SCALE,
            Item.FOSSIL_STONE
          ].map((item) => (
            <img
              key={item}
              src={`assets/item/${item}.png`}
              className="item"
              data-tooltip-id="item-detail-tooltip"
              data-tooltip-content={item}
            />
          ))}
        </div>
        <p>{t("wiki.double_up.trade_rules")}</p>
      </section>

      <section className="my-box">
        <h2>3. Hoopa's Prison Bottle</h2>
        <p>{t("wiki.double_up.prison_bottle_desc")}</p>
        <ul>
          <li>{t("wiki.double_up.prison_bottle_cooldown_long")}</li>
          <li>{t("wiki.double_up.prison_bottle_cooldown_short")}</li>
        </ul>
      </section>

      <section className="my-box">
        <h2>4. Reinforcements</h2>
        <p>{t("wiki.double_up.reinforcements_desc")}</p>
      </section>

      <section className="my-box">
        <h2>5. Purple Kecleon's Gift Shop</h2>
        <p>{t("wiki.double_up.gift_desc")}</p>
      </section>

      <section className="my-box">
        <h2>Starting a Lobby</h2>
        <p>{t("wiki.double_up.lobby_desc")}</p>
      </section>
      <ItemDetailTooltip />
    </div>
  )
}
