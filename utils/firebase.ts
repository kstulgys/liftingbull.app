import * as firebase from 'firebase/app'
import 'firebase/auth'

// let defaultApp

const defaultAppConfig = {
  apiKey: 'AIzaSyADxTKXGWQi3efM0mXQwgkXlfZhqIoqIIg',
  authDomain: 'liftingbull-app.firebaseapp.com',
  projectId: 'liftingbull-app',
  appId: '1:1092891371959:web:a5a0e17324559aeab86032',
}

if (!firebase.apps.length) {
  firebase.initializeApp(defaultAppConfig)
}

//   firebase.initializeApp({
//     apiKey: 'AIzaSyADxTKXGWQi3efM0mXQwgkXlfZhqIoqIIg',
//     authDomain: 'liftingbull-app.firebaseapp.com',
//     projectId: 'liftingbull-app',
//     appId: '1:1092891371959:web:a5a0e17324559aeab86032',
//     // databaseURL: 'https://liftingbull-app.firebaseio.com',
//     // storageBucket: 'liftingbull-app.appspot.com',
//     // messagingSenderId: '1092891371959',
//     // measurementId: 'G-3EY9F8EZC0',
//   })

export { firebase }
