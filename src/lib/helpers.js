import { CONFIG } from '@/config'

export const todayStr = () => new Date().toISOString().slice(0, 10)

export const getDayStatus = (pct) => {
  if (pct >= CONFIG.dayStatusThresholds.win)     return 'win'
  if (pct >= CONFIG.dayStatusThresholds.solid)   return 'solid'
  if (pct >= CONFIG.dayStatusThresholds.average) return 'average'
  return 'chaotic'
}

export const getDayColor = (s) =>
  ({ win: '#4ade80', solid: '#60a5fa', average: '#fbbf24', chaotic: '#f87171' }[s] || '#334155')

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

export const getWeekStart = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return d.toISOString().slice(0, 10)
}

export const getMonthDays = (year, month) => {
  const days = []
  const d = new Date(year, month, 1)
  const dow = d.getDay()
  for (let i = 0; i < (dow === 0 ? 6 : dow - 1); i++) days.push(null)
  while (d.getMonth() === month) { days.push(new Date(d)); d.setDate(d.getDate() + 1) }
  return days
}

export const MONTH_NAMES = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'
]
export const DAY_LABELS = ['Pn','Wt','Śr','Cz','Pt','Sb','Nd']
