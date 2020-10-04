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

interface State {
  [key: string]: any
}

export const useAuth = create<State>((set, get) => ({
  isLoading: true,
  user: null,
  error: '',
  isFormLoading: false,
  actions: {
    listenForAuthStateChange: ({ onSuccess, onFailure }) => {
      set({ isLoading: true })
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const settingsRef = db.collection('settings').doc(user.uid)
          const userRef = db.collection('user').doc(user.uid)

          try {
            const doc = await userRef.get()
            if (doc.exists) {
              set({ user: { ...doc.data() }, isLoading: false })
              onSuccess()
            } else {
              await userRef.set({ uid: user.uid, email: user.email, displayName: user.displayName })
              await settingsRef.set({
                units: defaultUnits,
                currentWorkoutProps: defaultCurrentWorkoutProps,
                plates: defaultPlates,
                oneRepMaxProps: defaultOneRepMaxProps,
              })
              set({ user: { ...doc.data() }, isLoading: false })
              onSuccess()
            }
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
    signin: async (email: string, password: string) => {
      set({ isFormLoading: true, error: '' })
      try {
        const response = await firebase.auth().signInWithEmailAndPassword(email, password)
        set({ user: response.user, isFormLoading: false })
      } catch (error) {
        console.log({ error })
        set({ error: error.message, isFormLoading: false })
      }
    },
    signup: async (email, password) => {
      set({ isFormLoading: true, error: '' })
      try {
        const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
        set({ user: response.user, isFormLoading: false })
      } catch (error) {
        set({ error: error.message, isFormLoading: false })
      }
    },
    signout: () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          set({ user: null })
        })
    },
    sendPasswordResetEmail: (email) => {
      set({ isFormLoading: true, error: '' })
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => set({ isFormLoading: false, error: 'Please check your inbox.' }))
    },
    confirmPasswordReset: (code, password) => {
      firebase
        .auth()
        .confirmPasswordReset(code, password)
        .then(() => {
          return true
        })
    },
  },
}))
