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

export function getPlatesOnBar(weight: number, barbellWeight: number, plates: number[]): string {
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

export function getPercentFromTo({ from, to }) {
  return Array(to)
    .fill(null)
    .map((_, idx) => {
      if (idx + 1 >= from) return (idx + 1) / 100
    })
    .filter(Boolean)
}

export function getWeightPercents() {
  const array = Array(110)
    .fill(null)
    .map((_, idx) => {
      const numString = idx + 1 + ''
      if (idx + 1 <= 9) return null
      if (numString[numString.length - 1] === '0' || numString[numString.length - 1] === '5') {
        return (idx + 1) / 100
      }
    })
    .filter(Boolean)
  return [0, ...array]
}

export function getWeightNumbers(units: 'kg' | 'lbs', currentValue) {
  const res = []
  const round = (num) => +num.toFixed(1)
  const lowPoint = round(currentValue - 20)
  const maxPoint = round(currentValue + 20)

  if (units === 'lbs') {
    for (let i = lowPoint; i <= maxPoint; i++) {
      res.push({ name: i, value: i })
    }
  }

  if (units === 'kg') {
    for (let idx = lowPoint; idx <= maxPoint; idx++) {
      res.push({ name: idx, value: idx })
      res.push({ name: round(idx + 0.1), value: round(idx + 0.1) })
      res.push({ name: round(idx + 0.2), value: round(idx + 0.2) })
      res.push({ name: round(idx + 0.3), value: round(idx + 0.3) })
      res.push({ name: round(idx + 0.4), value: round(idx + 0.4) })
      res.push({ name: round(idx + 0.5), value: round(idx + 0.5) })
      res.push({ name: round(idx + 0.6), value: round(idx + 0.6) })
      res.push({ name: round(idx + 0.7), value: round(idx + 0.7) })
      res.push({ name: round(idx + 0.8), value: round(idx + 0.8) })
      res.push({ name: round(idx + 0.9), value: round(idx + 0.9) })
    }
  }

  return res
}

export function getRpeList() {
  return [
    { name: 6.5, value: 6.5 },
    { name: 7, value: 7 },
    { name: 7.5, value: 7.5 },
    { name: 8, value: 8 },
    { name: 8.5, value: 8.5 },
    { name: 9, value: 9 },
    { name: 9.5, value: 9.5 },
    { name: 10, value: 10 },
  ]
}

export function getRepsList() {
  return [
    { name: 1, value: 1 },
    { name: 2, value: 2 },
    { name: 3, value: 3 },
    { name: 4, value: 4 },
    { name: 5, value: 5 },
    { name: 6, value: 6 },
    { name: 7, value: 7 },
    { name: 8, value: 8 },
    { name: 9, value: 9 },
    { name: 10, value: 10 },
  ]
}

export function convertToLbs(kg) {
  return Math.round(kg * 2.205)
}

export function convertToKg(lbs) {
  return +(lbs / 2.205).toFixed(1)
}

export function getKgAndLbs(units, weight): { weightKg: number; weightLbs: number } {
  if (units === 'kg') {
    const weightKg = weight
    const weightLbs = convertToLbs(weightKg)
    return { weightLbs, weightKg }
  }

  if (units === 'lbs') {
    const weightLbs = weight
    const weightKg = convertToKg(weightLbs)
    return { weightLbs, weightKg }
  }
}

interface calculateOneRepMaxProps {
  weightKg: number
  weightLbs: number
  units: string
  rpe: number
  reps: number
}

export function calculateOneRepMax(props: calculateOneRepMaxProps) {
  const { weightKg, weightLbs, units, rpe, reps } = props
  const weight = units === 'kg' ? weightKg : weightLbs
  if (units === 'kg') {
    return calcOneRepMaxKg(rpe, reps, weight)
  } else {
    return calcOneRepMaxLbs(rpe, reps, weight)
  }
}
