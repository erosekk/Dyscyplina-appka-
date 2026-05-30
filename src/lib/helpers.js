import { CONFIG } from '@/config'

export const todayStr = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const getDayStatus = (pct) => {
  if (pct >= CONFIG.dayStatusThresholds.excellent) return 'excellent'
  if (pct >= CONFIG.dayStatusThresholds.good)      return 'good'
  if (pct >= CONFIG.dayStatusThresholds.average) return 'average'
  return 'weak'
}

export const getDayColor = (s) =>
  ({ excellent: '#4ade80', good: '#60a5fa', average: '#fbbf24', weak: '#f87171' }[s] || '#334155')

export const calcScore = (data) => {
  if (!data) return 0
  let s = 0
  CONFIG.tasks.forEach(t => { if (data.completedTasks?.[t.id]) s += t.pts })
  ;(data.trainings || []).forEach(tid => {
    const tr = CONFIG.trainingOptions.find(t => t.id === tid)
    if (tr) s += tr.pts
  })
  return s
}

export const hasDayActivity = (data) => {
  if (!data) return false
  return Boolean(
    Object.values(data.completedTasks || {}).some(Boolean) ||
    (data.trainings || []).length ||
    data.note?.trim() ||
    data.skipReason?.trim() ||
    data.mood != null ||
    data.energy != null ||
    data.workMode
  )
}

export const addDays = (dateStr, amount) => {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + amount)
  return d.toISOString().slice(0, 10)
}

export const getWeekKeys = (dateStr) => {
  const start = getWeekStart(dateStr)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const getMonthKeys = (year, month) =>
  getMonthDays(year, month).filter(Boolean)

export const sumScores = (allDays, keys) =>
  keys.reduce((total, key) => total + calcScore(allDays[key]), 0)

export const getWeekStart = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = date.getDay()
  date.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1))
  const yr = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const dy = String(date.getDate()).padStart(2, '0')
  return `${yr}-${mo}-${dy}`
}

export const getMonthDays = (year, month) => {
  const days = []
  const first = new Date(year, month, 1)
  const dow = first.getDay()
  for (let i = 0; i < (dow === 0 ? 6 : dow - 1); i++) days.push(null)
  const d = new Date(year, month, 1)
  while (d.getMonth() === month) {
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const dy = String(d.getDate()).padStart(2, '0')
    days.push(`${y}-${mo}-${dy}`)
    d.setDate(d.getDate() + 1)
  }
  return days
}

export const MONTH_NAMES = [
  'Styczen','Luty','Marzec','Kwiecien','Maj','Czerwiec',
  'Lipiec','Sierpien','Wrzesien','Pazdziernik','Listopad','Grudzien'
]
export const DAY_LABELS = ['Pn','Wt','Sr','Cz','Pt','Sb','Nd']
