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

// const initialState: State = {
//   oneRepMax: [],
//   currentWorkoutProps: null,
//   oneRepMaxProps: null,
//   warmupSetsProps: null,
//   plates: null,
//   units: null,
// }

export const useStore = create((set, get) => ({
  currentWorkoutProps: null,
  oneRepMaxProps: null,
  plates: null,
  units: null,
  warmupSetsProps: null,

  actions: {
    getUserSettings: (uid) => {
      const settingsRef = db.collection('settings').doc(uid)
      settingsRef.onSnapshot((doc) => {
        set({ ...doc.data(), settingsRef })
      })
    },
  },
}))

// const unsub1 = api.subscribe((state) => console.log('state changed', state))
