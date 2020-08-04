export function writeStorage(key: string, data: any): any[] {
  console.log({ key })
  console.log({ data })

  window.localStorage.setItem(key, JSON.stringify(data))
  return data
}

export function readStorage(key: string): any[] | null {
  const item = window.localStorage.getItem(key) || 'null'
  return JSON.parse(item)
}

export function readOrWriteStorage(key: string, defaultValue: any): any[] {
  const item = readStorage(key)
  if (item) return item
  return writeStorage(key, defaultValue)
}

export const lookupTable: { [key: number]: any[] } = {
  10: [null, 1, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68],
  9.5: [null, 0.978, 0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667],
  9: [null, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653],
  8.5: [null, 0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64],
  8: [null, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626],
  7.5: [null, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613],
  7: [null, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599],
  6.5: [null, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613, 0.586],
  // 6: [
  //   null,
  //   0.863,
  //   0.837,
  //   0.811,
  //   0.786,
  //   0.762,
  //   0.739,
  //   0.707,
  //   0.68,
  //   0.653,
  //   0.626,
  //   0.599,
  //   0.599,
  //   0.572
  // ]
}

export function calcOneRepMaxKg(rpe: number, reps: number, weight: number): number {
  return +(weight / lookupTable[rpe][reps]).toFixed(1)
}

export function calcOneRepMaxLbs(rpe: number, reps: number, weight: number): number {
  return Math.round(weight / lookupTable[rpe][reps])
}

export function getWorksetWeight(rpe: number, reps: number, oneRM: number): number {
  return +(oneRM * lookupTable[rpe][reps]).toFixed(1)
}

export function getPlatesOnBar(weight: number, barbellWeight: number, plates: number[], units?: string): string {
  let oneSideWeight = +((weight - barbellWeight) / 2).toFixed(1)

  const result: string[] = plates.reduce((acc: string[], plate: number) => {
    const platesQuantity = Math.floor(oneSideWeight / plate)
    if (platesQuantity >= 1) {
      oneSideWeight -= +(platesQuantity * plate)
      return [...acc, `${plate}${platesQuantity > 1 ? 'x' + platesQuantity : ''}`]
    }
    return acc
  }, [])
  return result.reduce((acc, next, idx) => {
    if (idx === 0) return acc + next
    return acc + '/' + next
  }, '')
}

export function getRepsNumbers() {
  return Array(20)
    .fill(null)
    .map((_, idx) => idx + 1)
}

export function getWeightPercents() {
  const array = Array(110)
    .fill(null)
    .map((_, idx) => {
      const numString = idx + 1 + ''
      if (numString[numString.length - 1] === '0' || numString[numString.length - 1] === '5') {
        return (idx + 1) / 100
      }
    })
    .filter(Boolean)
  return [0, ...array]
}

export function getWeightNumbers() {
  return Array(1000)
    .fill(null)
    .map((_, idx) => idx + 1)
}

export function getRpeList() {
  return [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
}

export function getRepsList() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

export function convertToLbs(kg) {
  return Math.round(kg * 2.205)
}

export function convertToKg(lbs) {
  return +(lbs / 2.205).toFixed(1)
}

export function getKgAndLbs(units, weight): { weightKg: number; weightLbs: number } {
  let weightKg
  let weightLbs
  if (units === 'kg') {
    weightKg = weight
    weightLbs = convertToLbs(weightKg)
  }
  if (units === 'lbs') {
    weightLbs = weight
    weightKg = convertToKg(weightKg)
  }

  return {
    weightLbs,
    weightKg,
  }
}
