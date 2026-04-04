import { getAuth, signInAnonymously, updateProfile } from "firebase/auth"
import { useTranslation } from "react-i18next"
import { Starters } from "../../../../../types/enum/Starters"
import { generateRandomName } from "../../../../../utils/name-generation"
import { pickRandomIn } from "../../../../../utils/random"

export default function AnonymousButton() {
  const { t } = useTranslation()
  async function signIn() {
    const auth = getAuth()
    try {
      await signInAnonymously(auth)
      if (auth.currentUser) {
        const starterPokemon = pickRandomIn(Starters)
        const randomName = generateRandomName(starterPokemon)
        await updateProfile(auth.currentUser, { displayName: randomName })
        window.location.href = window.location.href + "lobby"
      }
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div>
      <div>
        <button
          className="firebaseui-idp-button anonymous"
          style={{ display: "flex", alignItems: "center" }}
          onClick={signIn}
        >
          <img style={{ width: "30px" }} src="assets/ui/unown.svg" />
          <span
            style={{ color: "#464646", paddingLeft: "5px" }}
            className="firebaseui-idp-text"
          >
            {t("join_as_guest")}
          </span>
        </button>
      </div>
    </div>
  )
}
