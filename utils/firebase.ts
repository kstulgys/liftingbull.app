import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const isProd = process.env.NODE_ENV === 'production'

const config = {
  prod: {
    apiKey: process.env.NEXT_PUBLIC_PROD_apiKey,
    authDomain: process.env.NEXT_PUBLIC_PROD_authDomain,
    projectId: process.env.NEXT_PUBLIC_PROD_projectId,
    appId: process.env.NEXT_PUBLIC_PROD_appId,
  },
  dev: {
    apiKey: process.env.NEXT_PUBLIC_DEV_apiKey,
    authDomain: process.env.NEXT_PUBLIC_DEV_authDomain,
    projectId: process.env.NEXT_PUBLIC_DEV_projectId,
    appId: process.env.NEXT_PUBLIC_DEV_appId,
  },
}

const defaultAppConfig = isProd ? config.prod : config.dev

if (!firebase.apps.length) {
  firebase.initializeApp(defaultAppConfig)
}

const db = firebase.firestore()

export { firebase, db }
