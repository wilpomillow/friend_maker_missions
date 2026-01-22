export function getWeekKeyMondayUTC(date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay()
  const diffToMonday = (day + 6) % 7
  d.setUTCDate(d.getUTCDate() - diffToMonday)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}
export function formatUTCDateLabel(isoYYYYMMDD: string): string {
  const [y, m, d] = isoYYYYMMDD.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
}
