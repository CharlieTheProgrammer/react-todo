import firebase from './firebase'
// According to docs, this should be imported for side effects.
import firestore from 'firebase/firestore'

const db = firebase.firestore()

export default db
