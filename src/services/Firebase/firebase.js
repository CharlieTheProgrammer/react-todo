import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import FirebaseContext from './context'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_APP_ID,
    appId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};


const firebaseUiConfig = {
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    signInFlow: 'popup',
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
    },
    callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            window.location.assign(`/workspace/${authResult.user.uid}`)
        }
    }
}


class Firebase {
    constructor() {
        firebase.initializeApp(firebaseConfig)
        this.auth = firebase.auth()
        this.db = firebase.firestore()
        this.uid = false
        this.uiConfig = firebaseUiConfig
    }

    getFirebaseUiConfig = () => {
        return firebaseUiConfig
    }

    setUid = (uid) => {
        this.uid = uid
    }

    isUidSet = () => {
        if (!this.uid) {
            return false
        }
        return true
    }

    // *** Helpers ***
    deleteField = () => firebase.firestore.FieldValue.delete()

    // *** User API ***
    user = (uid) => {
        //if(!this.uid) throw Error("Uid must be set before accessing user.")
        return this.db.collection('users').doc(uid)
    }

    // *** Lists API ***
    lists = (uid) => this.db.collection('lists').doc(uid)

    // *** Todos API ***
    todos = (uid) => this.db.collection('todos').doc(uid)

}

export default Firebase
export { FirebaseContext }