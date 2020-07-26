import create from "zustand";
import { v4 as uuid } from "uuid";

import { lookupTable } from "./utils";

const defaultWarmupSets = [
  { id: 1, percent: 0, reps: 15 },
  { id: 2, percent: 0.55, reps: 8 },
  { id: 3, percent: 0.8, reps: 5 },
  { id: 4, percent: 0.9, reps: 3 },
];

const defaultOneRepMaxProps = [
  { id: 1, name: "DL", rpe: 10, reps: 5, weight: 150 },
  { id: 2, name: "SQ", rpe: 10, reps: 5, weight: 120 },
  { id: 3, name: "BP", rpe: 10, reps: 5, weight: 100 },
  { id: 4, name: "OP", rpe: 10, reps: 5, weight: 60 },
];

interface State {
  oneRepMax: any[];
  oneRepMaxProps: { id: number; rpe: number; reps: number; weight: number }[];
  warmupSets: { id: any; percent: number; reps: number }[];
  currentWorkout: any[];
}

const initialState: State = {
  oneRepMax: [],
  oneRepMaxProps: [],
  warmupSets: [],
  currentWorkout: [],
};

export const [useStore, api] = create((set, get) => ({
  ...initialState,
  removeWorkoutSet: (workoutId, setIdx) => {
    const { currentWorkout } = get();
    currentWorkout.forEach(({ id, sets }) => {
      if (id === workoutId) sets.splice(setIdx, 1);
    });
    window.localStorage.setItem("currentWorkout", JSON.stringify(currentWorkout));
    set({ currentWorkout });
  },
  addWorkoutSet: (_id) => {
    const { currentWorkout } = get();
    const found = currentWorkout.find(({ id }) => id === _id);
    found.sets.push({ id: uuid(), reps: 5, rpe: 8 });
    window.localStorage.setItem("currentWorkout", JSON.stringify(currentWorkout));
    set({ currentWorkout });
  },
  addWorkout: () => {
    const { currentWorkout } = get();
    const sets = [
      ...currentWorkout,
      {
        id: uuid(),
        name: "DL",
        sets: [
          { id: uuid(), reps: 5, rpe: 7 },
          { id: uuid(), reps: 5, rpe: 8 },
        ],
      },
    ];
    window.localStorage.setItem("currentWorkout", JSON.stringify(sets));
    set({ currentWorkout: sets });
  },
  removeWorkout: (_id) => {
    const { currentWorkout } = get();
    const filtered = currentWorkout.filter(({ id }) => id !== _id);
    window.localStorage.setItem("currentWorkout", JSON.stringify(filtered));
    set({ currentWorkout: filtered });
  },
  updateOneRepMaxProps: (_name, prop, data) => {
    const { oneRepMaxProps, getOneRepMax } = get();
    const found = oneRepMaxProps.find(({ name }) => name === _name);
    found[prop] = +data;
    window.localStorage.setItem("oneRepMaxProps", JSON.stringify(oneRepMaxProps));
    set({ oneRepMaxProps });
    getOneRepMax();
  },
  updateWarmupSet: (_id, prop, data) => {
    const { warmupSets } = get();
    const found = warmupSets.find(({ id }) => id === _id);
    found[prop] = data;
    window.localStorage.setItem("warmupSets", JSON.stringify(warmupSets));
    set({ warmupSets });
  },
  addWarmupSet: () => {
    const { warmupSets } = get();
    const sets = [...warmupSets, { id: uuid(), percent: 0.9, reps: 3 }];
    window.localStorage.setItem("warmupSets", JSON.stringify(sets));
    set({ warmupSets: sets });
  },
  removeWarmupSet: (_id) => {
    const { warmupSets } = get();
    if (warmupSets.length === 3) return;
    const filtered = warmupSets.filter(({ id }) => id !== _id);
    window.localStorage.setItem("warmupSets", JSON.stringify(filtered));
    set({ warmupSets: filtered });
  },
  getWarmupSets: () => {
    if (typeof window === undefined) return;
    const warmupSets = window.localStorage.getItem("warmupSets") || null;
    if (!warmupSets) {
      window.localStorage.setItem("warmupSets", JSON.stringify(defaultWarmupSets));
      set({ warmupSets: defaultWarmupSets });
    }
    if (warmupSets) set({ warmupSets: JSON.parse(warmupSets) });
  },
  getOneRepMaxProps: () => {
    if (typeof window === undefined) return;
    const oneRepMaxProps = window.localStorage.getItem("oneRepMaxProps") || null;
    if (!oneRepMaxProps) {
      window.localStorage.setItem("oneRepMaxProps", JSON.stringify(defaultOneRepMaxProps));
      set({ oneRepMaxProps: defaultOneRepMaxProps });
    }
    if (oneRepMaxProps) set({ oneRepMaxProps: JSON.parse(oneRepMaxProps) });
  },
  getCurrentWorkout: () => {
    if (typeof window === undefined) return;
    const data = window.localStorage.getItem("currentWorkout") || null;
    if (data) set({ currentWorkout: JSON.parse(data) });
  },
  getOneRepMax: () => {
    const { oneRepMaxProps } = get();
    if (oneRepMaxProps.length === 0) return;

    const dl = oneRepMaxProps.find(({ name }) => name === "DL");
    const sq = oneRepMaxProps.find(({ name }) => name === "SQ");
    const bp = oneRepMaxProps.find(({ name }) => name === "BP");
    const op = oneRepMaxProps.find(({ name }) => name === "OP");

    const data = [
      { id: 1, name: "DL", weight: calcOneRepMaxKg(dl.rpe, dl.reps, dl.weight) },
      { id: 2, name: "SQ", weight: calcOneRepMaxKg(sq.rpe, sq.reps, sq.weight) },
      { id: 3, name: "BP", weight: calcOneRepMaxKg(bp.rpe, bp.reps, bp.weight) },
      { id: 4, name: "OP", weight: calcOneRepMaxKg(op.rpe, op.reps, op.weight) },
    ];
    set({ oneRepMax: data });
  },
}));

const unsub1 = api.subscribe((state) => console.log("state changed", state));

function calcOneRepMaxKg(rpe, reps, weight) {
  return +(weight / lookupTable[rpe][reps]).toFixed(1);
}
