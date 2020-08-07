import cookie from 'js-cookie'
import create from 'zustand'
import { firebase, db } from '../utils/firebase'

const defaultOneRepMaxProps = [
  {
    id: 1,
    shortName: 'sq',
    weightKg: 200,
    weightLbs: 441,
    reps: 5,
    rpe: 10,
  },
  {
    id: 2,
    shortName: 'dl',
    weightKg: 200,
    weightLbs: 441,
    reps: 5,
    rpe: 10,
  },
]

const defaultWarmupSetsProps = [
  { id: 1, pct: 0, reps: 15 },
  { id: 2, pct: 0.55, reps: 8 },
  { id: 3, pct: 0.8, reps: 5 },
  { id: 4, pct: 0.9, reps: 3 },
]

const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }

export const [useAuth, api] = create((set, get) => ({
  loading: true,
  user: null,
  actions: {
    listenForAuthStateChange: (cbSuccess, cbFailure) => {
      set({ loading: true })
      const tokenName = 'liftingbull-app-token'

      return firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const { displayName, email, uid } = user
          const userRef = db.collection('users').doc(uid)
          const settingsRef = db.collection('settings').doc(uid)

          userRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                set({ user: { ...doc.data(), loading: false } })
              } else {
                userRef.set({ uid, displayName, email })
                settingsRef.set({
                  units: 'kg',
                  oneRepMaxProps: defaultOneRepMaxProps,
                  warmupSetsProps: defaultWarmupSetsProps,
                  currentWorkoutProps: [],
                  plates: defaultPlates,
                })
              }
            })
            .catch((error) => {
              console.log('Error getting document:', error)
            })
          const token = await user.getIdToken()
          cookie.set(tokenName, token, { expires: 365 })
          cbSuccess()
        } else {
          cookie.remove(tokenName)
          set({ user: null, loading: false })
          cbFailure()
        }
      })
    },
    signInWithGoogle: () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          console.log({ result })
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

// const authContext = createContext();

// // Provider component that wraps your app and makes auth object ...
// // ... available to any child component that calls useAuth().
// export function ProvideAuth({ children }) {
//   const auth = useProvideAuth();
//   return <authContext.Provider value={auth}>{children}</authContext.Provider>;
// }

// // Hook for child components to get the auth object ...
// // ... and re-render when it changes.
// export const useAuth = () => {
//   return useContext(authContext);
// };

// // Provider hook that creates auth object and handles state
// function useProvideAuth() {
//   const [user, setUser] = useState(null);

//   // Wrap any Firebase methods we want to use making sure ...
//   // ... to save the user to state.
//   const signin = (email, password) => {
//     return firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(response => {
//         setUser(response.user);
//         return response.user;
//       });
//   };

//   const signup = (email, password) => {
//     return firebase
//       .auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(response => {
//         setUser(response.user);
//         return response.user;
//       });
//   };

//   const signout = () => {
//     return firebase
//       .auth()
//       .signOut()
//       .then(() => {
//         setUser(false);
//       });
//   };

//   const sendPasswordResetEmail = email => {
//     return firebase
//       .auth()
//       .sendPasswordResetEmail(email)
//       .then(() => {
//         return true;
//       });
//   };

//   const confirmPasswordReset = (code, password) => {
//     return firebase
//       .auth()
//       .confirmPasswordReset(code, password)
//       .then(() => {
//         return true;
//       });
//   };

//   // Subscribe to user on mount
//   // Because this sets state in the callback it will cause any ...
//   // ... component that utilizes this hook to re-render with the ...
//   // ... latest auth object.
//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(false);
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, []);

//   // Return the user object and auth methods
//   return {
//     user,
//     signin,
//     signup,
//     signout,
//     sendPasswordResetEmail,
//     confirmPasswordReset
//   };
// }
