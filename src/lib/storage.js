// ============================================================
// STORAGE — localStorage wrapper
// Gotowe na migracje do Supabase w przyszlosci
// ============================================================

const KEY = 'dyscyplina_v1'
const WEIGHT_KEY = 'dyscyplina_weight_v1'

// Day data shape:
// { workMode, completedTasks: {}, trainings: [], note, skipReason }

export function getAllDays() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export function saveAllDays(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getDay(date) {
  const all = getAllDays()
  return all[date] || initDayData()
}

export function saveDay(date, data) {
  const all = getAllDays()
  all[date] = data
  saveAllDays(all)
}

export function initDayData() {
  return { workMode: 'free', completedTasks: {}, trainings: [], note: '', skipReason: '' }
}

// Weight log
export function getWeightLog() {
  try { return JSON.parse(localStorage.getItem(WEIGHT_KEY)) || [] } catch { return [] }
}

export function saveWeightEntry(date, weight) {
  const log = getWeightLog()
  const idx = log.findIndex(e => e.date === date)
  if (idx >= 0) log[idx].weight = weight
  else log.push({ date, weight })
  log.sort((a, b) => a.date.localeCompare(b.date))
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(log))
  return log
}

export function getNextWeighDate() {
  const log = getWeightLog()
  if (log.length === 0) return null
  const last = new Date(log[log.length - 1].date + 'T12:00:00')
  last.setDate(last.getDate() + 14)
  return last.toISOString().slice(0, 10)
}
