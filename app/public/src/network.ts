import { User } from "@firebase/auth-types"
import firebase from "firebase/compat/app"
import { CloseCodes } from "../../types/enum/CloseCodes"
import { IUserMetadataJSON } from "../../types/interfaces/UserMetadata"
import { FIREBASE_CONFIG } from "./pages/utils/utils"
import store from "./stores"
import { logIn, setProfile } from "./stores/NetworkStore"

export function authenticateUser() {
    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
    }

    return new Promise<User>((resolve, reject) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) return reject(CloseCodes.USER_NOT_AUTHENTICATED)
            store.dispatch(logIn(user))
            fetchProfile()
            resolve(user)
        })
    })
}

export async function fetchProfile(
    forceRefresh: boolean = false
) {
    const profile = store.getState().network.profile
    const token = await firebase.auth().currentUser?.getIdToken()
    if (!forceRefresh && profile) {
        return Promise.resolve(profile)
    }
    return fetch("/profile", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then((res) => res.json())
        .then((profile: IUserMetadataJSON) => {
            store.dispatch(setProfile(profile))
        })
}
