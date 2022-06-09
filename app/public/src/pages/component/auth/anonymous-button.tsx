import { getAuth, signInAnonymously, updateProfile } from 'firebase/auth'
import { uniqueNamesGenerator, adjectives, colors, animals, Config } from 'unique-names-generator'


const customConfig: Config = {
    dictionaries: [adjectives, animals, colors],
    separator: ' ',
    length: 2
}

export default function AnonymousButton(){

    async function signIn(){
        const auth = getAuth()
        try {
            await signInAnonymously(auth)
            if(auth.currentUser){
                const randomName = uniqueNamesGenerator(customConfig) 
                await updateProfile(auth.currentUser,{displayName:randomName})
                window.location.href = window.location.href + 'lobby'
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
    <div>
        <button className='firebaseui-idp-button anonymous' style={{marginBottom:'10px'}}
        onClick={signIn}>
            <span style={{color:'#464646'}} className='firebaseui-idp-text'>Sign In Anonymously</span>
        </button>
    </div>
</div>
}