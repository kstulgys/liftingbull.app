import create from 'zustand'
import { v4 as uuid } from 'uuid'
import { lookupTable } from '.'
import produce from 'immer'
// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (args) => {
      console.log('  applying', args)
      set(args)
      console.log('  new state', get())
    },
    get,
    api
  )

// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) => config((fn) => set(produce(fn)), get, api)

const storeTwo = (set, get, api) => ({
  text: 'hello',
  actions: {
    setText: (input) =>
      set((state) => {
        state.text = input
      }),
  },
})

export const [useStoreTwo] = create(immer(storeTwo))

const defaultWarmupSets = [
  { id: 1, percent: 0, reps: 15 },
  { id: 2, percent: 0.55, reps: 8 },
  { id: 3, percent: 0.8, reps: 5 },
  { id: 4, percent: 0.9, reps: 3 },
]

const defaultOneRepMaxProps = [
  { id: 1, name: 'DL', rpe: 10, reps: 5, weight: 150 },
  { id: 2, name: 'SQ', rpe: 10, reps: 5, weight: 120 },
  { id: 3, name: 'BP', rpe: 10, reps: 5, weight: 100 },
  { id: 4, name: 'OP', rpe: 10, reps: 5, weight: 60 },
]

interface State {
  oneRepMax: any[]
  oneRepMaxProps: { id: any; rpe: number; reps: number; weight: number }[]
  warmupSets: { id: any; percent: number; reps: number }[]
  currentWorkout: any[]
}

const initialState: State = {
  oneRepMax: [],
  oneRepMaxProps: [],
  warmupSets: [],
  currentWorkout: [],
}

const store = (set, get, api) => ({
  ...initialState,
  removeWorkoutSet: (workoutId: string, setIdx: number) => {
    set((state) => {
      state.currentWorkout = state.currentWorkout.forEach(({ id, sets }) => {
        if (id === workoutId) sets.splice(setIdx, 1)
      })
      window.localStorage.setItem('currentWorkout', JSON.stringify(state.currentWorkout))
    })
    // const { currentWorkout } = get()
    // currentWorkout.forEach(({ id, sets }) => {
    //   if (id === workoutId) sets.splice(setIdx, 1)
    // })
    // set({ currentWorkout })
  },
  addWorkoutSet: (_id) => {
    const { currentWorkout } = get()
    const found = currentWorkout.find(({ id }) => id === _id)
    found.sets.push({ id: uuid(), reps: 5, rpe: 8 })
    window.localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout))
    set({ currentWorkout })
  },
  addWorkout: () => {
    const { currentWorkout } = get()
    const sets = [
      ...currentWorkout,
      {
        id: uuid(),
        name: 'DL',
        sets: [
          { id: uuid(), reps: 5, rpe: 7 },
          { id: uuid(), reps: 5, rpe: 8 },
        ],
      },
    ]
    window.localStorage.setItem('currentWorkout', JSON.stringify(sets))
    set({ currentWorkout: sets })
  },
  removeWorkout: (_id) => {
    const { currentWorkout } = get()
    const filtered = currentWorkout.filter(({ id }) => id !== _id)
    window.localStorage.setItem('currentWorkout', JSON.stringify(filtered))
    set({ currentWorkout: filtered })
  },
  updateOneRepMaxProps: (_name, prop, data) => {
    const { oneRepMaxProps, getOneRepMax } = get()
    const found = oneRepMaxProps.find(({ name }) => name === _name)
    found[prop] = +data
    window.localStorage.setItem('oneRepMaxProps', JSON.stringify(oneRepMaxProps))
    set({ oneRepMaxProps })
    getOneRepMax()
  },
  updateWarmupSet: (_id, prop, data) => {
    const { warmupSets } = get()
    const found = warmupSets.find(({ id }) => id === _id)
    found[prop] = data
    window.localStorage.setItem('warmupSets', JSON.stringify(warmupSets))
    set({ warmupSets })
  },
  addWarmupSet: () => {
    const { warmupSets } = get()
    const sets = [...warmupSets, { id: uuid(), percent: 0.9, reps: 3 }]
    window.localStorage.setItem('warmupSets', JSON.stringify(sets))
    set({ warmupSets: sets })
  },
  removeWarmupSet: (_id) => {
    const { warmupSets } = get()
    if (warmupSets.length === 3) return
    const filtered = warmupSets.filter(({ id }) => id !== _id)
    window.localStorage.setItem('warmupSets', JSON.stringify(filtered))
    set({ warmupSets: filtered })
  },
  getWarmupSets: () => {
    if (typeof window === undefined) return
    const warmupSets = window.localStorage.getItem('warmupSets') || null
    if (!warmupSets) {
      window.localStorage.setItem('warmupSets', JSON.stringify(defaultWarmupSets))
      set({ warmupSets: defaultWarmupSets })
    }
    if (warmupSets) set({ warmupSets: JSON.parse(warmupSets) })
  },
  actions: {
    bootstrapState: () => {
      set((state) => {
        const oneRepMaxProps = window.localStorage.getItem('oneRepMaxProps') || null
        if (oneRepMaxProps) state.oneRepMaxProps = JSON.parse(oneRepMaxProps)
        if (!oneRepMaxProps) {
          state.oneRepMaxProps = window.localStorage.setItem('oneRepMaxProps')
        }

        state.oneRepMaxProps = JSON.parse(window.localStorage.getItem('oneRepMaxProps') || JSON.stringify(defaultOneRepMaxProps))
        state.warmupSets = JSON.parse(window.localStorage.getItem('warmupSets') || JSON.stringify(defaultWarmupSets))
        state.currentWorkout = JSON.parse(window.localStorage.getItem('currentWorkout') || JSON.stringify([]))
      })
    },
    getOneRepMax: () => {
      set((state) => {
        if (state.oneRepMaxProps.length === 0) return
        const dl = state.oneRepMaxProps.find(({ name }) => name === 'DL')
        const sq = state.oneRepMaxProps.find(({ name }) => name === 'SQ')
        const bp = state.oneRepMaxProps.find(({ name }) => name === 'BP')
        const op = state.oneRepMaxProps.find(({ name }) => name === 'OP')
        const data = [
          {
            id: 1,
            name: 'DL',
            weight: calcOneRepMaxKg(dl.rpe, dl.reps, dl.weight),
          },
          {
            id: 2,
            name: 'SQ',
            weight: calcOneRepMaxKg(sq.rpe, sq.reps, sq.weight),
          },
          {
            id: 3,
            name: 'BP',
            weight: calcOneRepMaxKg(bp.rpe, bp.reps, bp.weight),
          },
          {
            id: 4,
            name: 'OP',
            weight: calcOneRepMaxKg(op.rpe, op.reps, op.weight),
          },
        ]
        state.oneRepMax = data
      })
    },
  },

  getCurrentWorkout: () => {
    if (typeof window === undefined) return
    const data = window.localStorage.getItem('currentWorkout') || null
    if (data) set({ currentWorkout: JSON.parse(data) })
  },
})

export const [useStore, api] = create(immer(store))

const unsub1 = api.subscribe((state) => console.log('state changed', state))

function calcOneRepMaxKg(rpe, reps, weight) {
  return +(weight / lookupTable[rpe][reps]).toFixed(1)
}
