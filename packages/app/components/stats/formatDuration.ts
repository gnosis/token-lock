const MILLIS_PER_DAY = 24 * 60 * 60 * 1000

export const pluralize = (number: number, unit: string) => {
  const rounded = Math.round(number)
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"}`
}

const closeToFull = (dividend: number, divisor: number, fuzziness = 2) => {
  const remainder = dividend % divisor
  return remainder <= fuzziness || divisor - remainder <= fuzziness
}

const formatDuration = (millis: number) => {
  const days = millis / MILLIS_PER_DAY

  if ((days >= 365 && closeToFull(days, 365)) || days > 3 * 365) {
    return pluralize(days / 365, "Year")
  }

  if ((days >= 30 && closeToFull(days, 30)) || days > 90) {
    return pluralize(days / 30, "Month")
  }

  return pluralize(days, "Day")
}

export default formatDuration
