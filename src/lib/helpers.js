import { CONFIG } from '@/config'

export const todayStr = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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