export const fmtYen = (v: number) => `¥${v.toLocaleString()}`
export const fmtYenK = (v: number) => `¥${(v / 1000).toFixed(0)}k`
export const fmtYenMan = (v: number) => `¥${(v / 10000).toFixed(0)}万`
export const fmtPct = (v: number) => `${v.toFixed(1)}%`
export const fmtCount = (v: number) => v.toLocaleString()

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat('ja-JP', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date))
  } catch {
    return ''
  }
}
