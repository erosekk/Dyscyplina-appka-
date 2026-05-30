'use client'
import { useState } from 'react'
import { CONFIG } from '@/config'
import { calcScore, getDayColor, getDayStatus, hasDayActivity, addDays, todayStr } from '@/lib/helpers'
import { getWeightLog, saveWeightEntry, getNextWeighDate } from '@/lib/storage'
import { Card, SectionLabel } from '@/components/ui'

const WeekChart = ({ allDays }) => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const key = addDays(todayStr(), -(29 - i))
    return calcScore(allDays[key])
  })
  const max = Math.max(...days, 1)
  const pts = days.map((s, i) => `${(i / 29) * 100},${40 - (s / max) * 40}`).join(' ')
  const statuses = days.map(s => getDayStatus((s / CONFIG.maxDailyScore) * 100))
  return (
    <Card style={{ marginBottom: 10 }}>
      <SectionLabel>Ostatnie 30 dni</SectionLabel>
      <svg viewBox="0 0 100 40" style={{ width: '100%', height: 56 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,40 ${pts} 100,40`} fill="url(#cg)" />
        <polyline points={pts} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {days.map((s, i) => s > 0 && (
          <circle key={i} cx={(i / 29) * 100} cy={40 - (s / max) * 40} r="1.5" fill={getDayColor(statuses[i])} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#334155', marginTop: 2 }}>
        <span>30 dni temu</span><span>Dzis</span>
      </div>
    </Card>
  )
}

const Records = ({ allDays }) => {
  const keys = Object.keys(allDays).sort()
  let bestScore = 0, bestDay = null, maxStreak = 0, cur = 0, streak = 0
  keys.forEach(k => { const s = calcScore(allDays[k]); if (s > bestScore) { bestScore = s; bestDay = k } })
  if (keys.length) {
    for (let k = keys[0]; k <= keys[keys.length - 1]; k = addDays(k, 1)) {
      if (hasDayActivity(allDays[k])) { cur++; if (cur > maxStreak) maxStreak = cur }
      else cur = 0
    }
  }
  for (let i = 0; i <= 60; i++) {
    const k = addDays(todayStr(), -i)
    if (hasDayActivity(allDays[k])) streak++
    else break
  }
  const bestLbl = bestDay ? new Date(bestDay + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }) : '—'
  return (
    <Card style={{ marginBottom: 10 }}>
      <SectionLabel>Rekordy</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { icon: '🔥', label: 'Seria teraz',      value: streak,    unit: 'dni' },
          { icon: '🏆', label: 'Najdluzsza seria', value: maxStreak, unit: 'dni' },
          { icon: '⭐', label: 'Najlepszy wynik',  value: bestScore,  unit: `pkt · ${bestLbl}` },
        ].map(r => (
          <div key={r.label} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{r.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{r.value}</div>
            <div style={{ fontSize: 9, color: '#334155', marginTop: 3 }}>{r.unit}</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

const WeightSection = () => {
  const [log, setLog] = useState(() => getWeightLog())
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState('')

  const nextDate = getNextWeighDate()
  const today = todayStr()
  const canLog = !nextDate || today >= nextDate

  const handleSave = () => {
    const val = parseFloat(input)
    if (!val || val < 20 || val > 300) { setMsg('Wpisz prawidlowa wage (np. 78.5)'); return }
    const updated = saveWeightEntry(today, val)
    setLog(updated)
    setInput('')
    const next = getNextWeighDate()
    const nextLbl = next ? new Date(next + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }) : ''
    setMsg(`Zapisano ${val} kg. Nastepny wpis: ${nextLbl}`)
    setTimeout(() => setMsg(''), 4000)
  }

  const reversed = [...log].reverse().slice(0, 6)
  const diff = log.length >= 2 ? (log[log.length - 1].weight - log[0].weight).toFixed(1) : null

  return (
    <Card style={{ marginBottom: 10 }}>
      <SectionLabel>Waga — wpis co 2 tygodnie</SectionLabel>

      {canLog ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>⚖️</span>
          <input type="number" step="0.1" placeholder="np. 78.5" value={input} onChange={e => setInput(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 15, outline: 'none' }} />
          <span style={{ color: '#475569', fontSize: 14 }}>kg</span>
          <button onClick={handleSave} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontSize: 13 }}>Zapisz</button>
        </div>
      ) : (
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', fontSize: 12, color: '#4ade80', marginBottom: 10 }}>
          Nastepny pomiar: {new Date(nextDate + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}
        </div>
      )}

      {msg && <div style={{ fontSize: 11, color: '#4ade80', marginBottom: 8 }}>{msg}</div>}

      {diff !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: parseFloat(diff) <= 0 ? '#4ade80' : '#f87171' }}>{diff > 0 ? '+' : ''}{diff} kg</div>
          <div style={{ fontSize: 11, color: '#475569' }}>{log[0].weight} kg → {log[log.length - 1].weight} kg lacznie</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {reversed.length === 0 && <div style={{ fontSize: 12, color: '#334155' }}>Brak wpisow. Dodaj pierwszy pomiar.</div>}
        {reversed.map((e, i) => {
          const prev = reversed[i + 1]
          const d = prev ? (e.weight - prev.weight).toFixed(1) : null
          return (
            <div key={e.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, color: '#475569' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                {e.weight} kg
                {d !== null && <span style={{ fontSize: 11, color: parseFloat(d) <= 0 ? '#4ade80' : '#f87171', marginLeft: 6 }}>{d > 0 ? '+' : ''}{d}</span>}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function StatsView({ allDays }) {
  const now = new Date()
  const prefix = now.toISOString().slice(0, 7)
  const keys = Object.keys(allDays).filter(k => k.startsWith(prefix))
  const logged = keys.filter(k => hasDayActivity(allDays[k])).length
  const goodDays = keys.filter(k => { const s = calcScore(allDays[k]); return s > 0 && (s / CONFIG.maxDailyScore * 100) >= CONFIG.dayStatusThresholds.good }).length
  const avgScore = logged > 0 ? Math.round(keys.reduce((a, k) => a + calcScore(allDays[k]), 0) / logged) : 0
  const taskStats = CONFIG.tasks.map(t => {
    const done = keys.filter(k => allDays[k]?.completedTasks?.[t.id]).length
    return { ...t, done, pct: logged > 0 ? Math.round((done / logged) * 100) : 0 }
  })

  return (
    <div style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Postep miesiaca</div>
        <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>{now.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Dobre dni',  value: goodDays, unit: `/ ${logged || '—'}`, color: '#4ade80' },
          { label: 'Sr. wynik',  value: avgScore,  unit: 'pkt',               color: '#60a5fa' },
          { label: 'Zalogowane', value: logged,    unit: 'dni',               color: '#c084fc' },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>{s.unit}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <WeekChart allDays={allDays} />
      <Records allDays={allDays} />
      <WeightSection />

      <div>
        <SectionLabel>Konsekwencja zadan</SectionLabel>
        {taskStats.map(t => (
          <Card key={t.id} style={{ padding: '11px 14px', marginBottom: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{t.emoji} {t.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.pct >= 70 ? '#4ade80' : t.pct >= 40 ? '#60a5fa' : '#f87171' }}>{t.pct}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${t.pct}%`, borderRadius: 99, transition: 'width 0.5s', background: t.pct >= 70 ? '#4ade80' : t.pct >= 40 ? '#60a5fa' : '#f87171' }} />
            </div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 3 }}>{t.done} / {logged} dni</div>
          </Card>
        ))}
      </div>

      <Card style={{ background: 'rgba(74,222,128,0.04)', borderColor: 'rgba(74,222,128,0.14)', marginTop: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#4ade80', marginBottom: 4 }}>
          {goodDays} {goodDays === 1 ? 'dobry dzien' : goodDays < 5 ? 'dobre dni' : 'dobrych dni'} w tym miesiacu
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>Nie chodzi o perfekcje. Chodzi o powrot.</div>
      </Card>
    </div>
  )
}
