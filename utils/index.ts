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

export function getWorksetWeight(rpe: number, reps: number, oneRM: number): number {
  return +(oneRM * lookupTable[rpe][reps]).toFixed(1)
}

export function getPlatesOnBar(weight: number, barbellWeight: number, plates: number[], units?: string): string {
  let oneSideWeight = +((weight - barbellWeight) / 2).toFixed(1)
  console.log({ oneSideWeight })
  return plates.reduce((acc, plate, idx) => {
    const platesQuantity = Math.floor(oneSideWeight / plate)
    if (platesQuantity >= 1) {
      oneSideWeight -= +(platesQuantity * plate)
      return acc + getString(idx === 0, plate, platesQuantity)
    }
    return acc
  }, '')
}

function getString(isFirst: boolean, plate: number, platesQuantity: number) {
  const prefix = isFirst ? '' : '/'
  const multiplyer = platesQuantity > 1 ? 'x' + platesQuantity : ''
  return prefix + plate + multiplyer
}
