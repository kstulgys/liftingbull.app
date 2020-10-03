import create from 'zustand'
import { firebase, db } from '../utils/firebase'
import { v4 as uuid } from 'uuid'

const defaultOneRepMaxProps = [
  { id: uuid(), shortName: 'DL', rpe: 10, reps: 5, weightKg: 200, weightLbs: 441 },
  { id: uuid(), shortName: 'SQ', rpe: 10, reps: 5, weightKg: 200, weightLbs: 441 },
  { id: uuid(), shortName: 'BP', rpe: 10, reps: 5, weightKg: 200, weightLbs: 441 },
  { id: uuid(), shortName: 'OP', rpe: 10, reps: 5, weightKg: 200, weightLbs: 441 },
]
const defaultCurrentWorkoutProps = { rpe: 8, reps: 6, shortName: 'DL' }
const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }
const defaultUnits = 'kg'

export const useAuth = create((set, get) => ({
  isLoading: true,
  user: null,
  userRef: null,
  actions: {
    listenForAuthStateChange: ({ onSuccess, onFailure }) => {
      set({ isLoading: true })
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = db.collection('users').doc(user.uid)
          const settingsRef = db.collection('settings').doc(user.uid)

          try {
            userRef.get().then((doc) => {
              if (doc.exists) {
                set({ user: { ...doc.data() }, userRef, isLoading: false })
                onSuccess()
              } else {
                userRef.set({ ...user })
                settingsRef.set({
                  units: defaultUnits,
                  currentWorkoutProps: defaultCurrentWorkoutProps,
                  plates: defaultPlates,
                  oneRepMaxProps: defaultOneRepMaxProps,
                })
                set({ user, isLoading: false, userRef })
              }
            })
          } catch (error) {
            console.log('Error getting document:', { error })
            set({ user: null, isLoading: false })
            onFailure()
          }
        } else {
          set({ user: null, isLoading: false })
          onFailure()
        }
      })
    },
    signInWithGoogle: () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          //   const token = result.credential.accessToken
          // The signed-in user info.
          //   const user = result.user
          // ...
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          // The email of the user's account used.
          const email = error.email
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential
          // ...
        })
    },
    signin: (email, password) => {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          set({ user: response.user })
          return response.user
        })
    },
    signup: (email, password) => {
      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          set({ user: response.user })
          return response.user
        })
    },
    signout: () => {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          set({ user: null })
        })
    },
    sendPasswordResetEmail: (email) => {
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          return true
        })
    },
    confirmPasswordReset: (code, password) => {
      return firebase
        .auth()
        .confirmPasswordReset(code, password)
        .then(() => {
          return true
        })
    },
  },
}))
