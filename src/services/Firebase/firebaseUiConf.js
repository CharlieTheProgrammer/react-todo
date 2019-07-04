import firebase from 'firebase/app'

const firebaseUiConfig = {
    signInSuccessUrl: '/workspace',
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
    }
}

export default firebaseUiConfig