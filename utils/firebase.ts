import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const defaultAppConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  appId: process.env.NEXT_PUBLIC_appId,
}

if (!firebase.apps.length) {
  firebase.initializeApp(defaultAppConfig)
}

const db = firebase.firestore()

export { firebase, db }
