import create from 'zustand'
import { v4 as uuid } from 'uuid'
import { readOrWriteStorage, calcOneRepMaxKg, calcOneRepMaxLbs } from '.'

const defaultWarmupSetsProps = [
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

const defaultCurrentWorkoutProps: never[] = []
const defaultPlates = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lbs: [45, 35, 25, 10, 5, 2.5] }
const defaultUnits = 'kg'
interface State {
  oneRepMax: any[]
  currentWorkoutProps: any[] | null
  oneRepMaxProps: { id: any; rpe: number; reps: number; weight: number }[] | null
  warmupSetsProps: { id: any; percent: number; reps: number }[] | null
  plates: { [key: string]: number[] } | null
  units: null
}

const initialState: State = {
  oneRepMax: [],
  currentWorkoutProps: null,
  oneRepMaxProps: null,
  warmupSetsProps: null,
  plates: null,
  units: null,
}

export const [useStore, api] = create((set, get) => ({
  ...initialState,
  actions: {
    // INITIALIZE STORE
    initializeState: () => {
      set({
        oneRepMaxProps: readOrWriteStorage('oneRepMaxProps', defaultOneRepMaxProps),
        warmupSetsProps: readOrWriteStorage('warmupSetsProps', defaultWarmupSetsProps),
        currentWorkoutProps: readOrWriteStorage('currentWorkoutProps', defaultCurrentWorkoutProps),
        plates: readOrWriteStorage('plates', defaultPlates),
        units: readOrWriteStorage('units', defaultUnits),
      })
    },

    // UNITS
    updateUnits: () => {
      const { units } = get()
      set({ units: units === 'kg' ? 'lbs' : 'kg' })
    },

    // PLATES
    updatePlates: (units: 'kg' | 'lbs', plate: number) => {
      const { plates } = get()
      const newPlates = plates[units].includes(plate) ? plates[units].filter((pl) => pl !== plate) : [...plates[units], plate]
      set({ plates: { ...plates, [units]: newPlates.sort((a, b) => b - a) } })
    },

    //EXERCISE PROPS
    updateExerciseSet: (exerciseIdx: number, setIdx: number, prop: string, data: any) => {
      const { currentWorkoutProps } = get()
      const copyArray = [...currentWorkoutProps]
      copyArray[exerciseIdx].sets[setIdx][prop] = +data
      set({ currentWorkoutProps: copyArray })
    },

    // WORKOUT
    removeWorkoutSet: (exerciseIdx: number, setIdx: number) => {
      const { currentWorkoutProps } = get()
      if (currentWorkoutProps[exerciseIdx].sets.length === 1) return
      const copyArray = [...currentWorkoutProps]
      copyArray[exerciseIdx].sets.splice(setIdx, 1)
      set({ currentWorkoutProps: copyArray })
    },
    addWorkoutSet: (idx: number) => {
      const { currentWorkoutProps } = get()
      const copyArray = [...currentWorkoutProps]
      copyArray[idx].sets.push({ id: uuid(), reps: 5, rpe: 8 })
      set({ currentWorkoutProps: copyArray })
    },
    addWorkout: () => {
      const { currentWorkoutProps } = get()
      set({
        currentWorkoutProps: [
          ...currentWorkoutProps,
          {
            id: uuid(),
            name: 'DL',
            sets: [
              { id: uuid(), reps: 5, rpe: 7 },
              { id: uuid(), reps: 5, rpe: 8 },
            ],
          },
        ],
      })
    },
    removeWorkout: (id) => {
      const { currentWorkoutProps } = get()
      set({ currentWorkoutProps: currentWorkoutProps.filter((item) => item.id !== id) })
    },

    // WARMUP SETS
    updateWarmupSet: (id, prop, data) => {
      const { warmupSetsProps } = get()
      const copyArray = [...warmupSetsProps]
      copyArray.find((item) => item.id === id)[prop] = data
      set({ warmupSetsProps: copyArray })
    },
    addWarmupSet: () => {
      const { warmupSetsProps } = get()
      set({ warmupSetsProps: [...warmupSetsProps, { id: uuid(), percent: 0.5, reps: 8 }] })
    },
    removeWarmupSet: (id) => {
      const { warmupSetsProps } = get()
      if (warmupSetsProps.length === 3) return
      set({ warmupSetsProps: [...warmupSetsProps.filter((item) => item.id !== id)] })
    },

    // ONE REP MAX
    updateOneRepMaxProps: (name: string, prop: string, data: string) => {
      const { oneRepMaxProps } = get()
      if (!oneRepMaxProps) return
      const copyArray = [...oneRepMaxProps]
      copyArray.find((element) => element.name == name)[prop] = +data
      set({ oneRepMaxProps: copyArray })
    },
    getOneRepMax: () => {
      const { oneRepMaxProps } = get()
      if (!oneRepMaxProps.length) return
      const dl = oneRepMaxProps.find(({ name }) => name === 'DL')
      const sq = oneRepMaxProps.find(({ name }) => name === 'SQ')
      const bp = oneRepMaxProps.find(({ name }) => name === 'BP')
      const op = oneRepMaxProps.find(({ name }) => name === 'OP')

      const data = [
        {
          id: 1,
          name: 'DL',
          weight: {
            kg: calcOneRepMaxKg(dl.rpe, dl.reps, dl.weight.kg),
            lbs: calcOneRepMaxLbs(dl.rpe, dl.reps, dl.weight.lbs),
          },
        },
        {
          id: 2,
          name: 'SQ',
          weight: {
            kg: calcOneRepMaxKg(sq.rpe, sq.reps, sq.weight.kg),
            lbs: calcOneRepMaxLbs(sq.rpe, sq.reps, sq.weight.lbs),
          },
        },
        {
          id: 3,
          name: 'BP',
          weight: {
            kg: calcOneRepMaxKg(bp.rpe, bp.reps, bp.weight.kg),
            lbs: calcOneRepMaxLbs(bp.rpe, bp.reps, bp.weight.lbs),
          },
        },
        {
          id: 4,
          name: 'OP',
          weight: {
            kg: calcOneRepMaxKg(op.rpe, op.reps, op.weight.kg),
            lbs: calcOneRepMaxLbs(op.rpe, op.reps, op.weight.lbs),
          },
        },
      ]
      set({ oneRepMax: data })
    },
    getCurrentWorkout: () => {
      const data = window.localStorage.getItem('currentWorkout') || null
      if (data) set({ currentWorkout: JSON.parse(data) })
    },
  },
}))

const unsub1 = api.subscribe((state) => console.log('state changed', state))
