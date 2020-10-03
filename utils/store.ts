import create from 'zustand'
import { db } from '../utils/firebase'

// interface State {
//   oneRepMax: any[]
//   currentWorkoutProps: any[] | null
//   oneRepMaxProps: { id: any; rpe: number; reps: number; weight: number }[] | null
//   warmupSetsProps: { id: any; percent: number; reps: number }[] | null
//   plates: { [key: string]: number[] } | null
//   units: null
// }

interface State {
  [key: string]: any
}

export const useStore = create<State>((set, get) => ({
  // currentWorkoutProps: null,
  // oneRepMaxProps: null,
  // plates: null,
  // units: null,
  // warmupSetsProps: null,
  // ...initialState,
  isLoading: true,

  actions: {
    getUserSettings: (uid: string) => {
      const settingsRef = db.collection('settings').doc(uid)
      const unsubscribe = settingsRef.onSnapshot((doc) => {
        set({ ...doc.data(), settingsRef, isLoading: false })
      })
    },
  },
}))

// const unsub1 = api.subscribe((state) => console.log('state changed', state))
