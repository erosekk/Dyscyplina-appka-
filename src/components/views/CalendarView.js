'use client'
import { useState } from 'react'
import { CONFIG } from '@/config'
import { calcScore, getDayColor, getDayStatus, getMonthDays, getWeekKeys, getMonthKeys, sumScores, hasDayActivity, todayStr, MONTH_NAMES, DAY_LABELS } from '@/lib/helpers'
import { Card, Ic } from '@/components/ui'

export default function CalendarView({ allDays, onSelectDay }) {
  const [view, setView] = useState(new Date())
  const [sel, setSel] = useState(null)
  const year = view.getFullYear(), month = view.getMonth()
  const days = getMonthDays(year, month)
  const selData = sel ? allDays[sel] : null
  const selScore = calcScore(selData)
  const selPct = (selScore / CONFIG.maxDailyScore) * 100
  const selStatus = selData ? getDayStatus(selPct) : null
  const summaryDate = sel || todayStr()
  const weekKeys = getWeekKeys(summaryDate)
  const monthKeys = getMonthKeys(year, month)
  const weekScore = sumScores(allDays, weekKeys)
  const monthScore = sumScores(allDays, monthKeys)
  const monthActiveDays = monthKeys.filter(key => hasDayActivity(allDays[key])).length
  const today = todayStr()
  const monthProgressKeys = monthKeys.filter(key => key <= today)
  const monthProgressScore = sumScores(allDays, monthProgressKeys)
  const monthProgressMax = monthProgressKeys.length * CONFIG.maxDailyScore

  return (
    <div style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Kalendarz</div>

      <Card style={{ marginBottom: 10 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => setView(d => new Date(d.getFullYear(), d.getMonth() - 1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', color: '#64748b' }}>
            <Ic n="chevL" sz={13} />
          </button>
          <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>{MONTH_NAMES[month]} {year}</span>
          <button onClick={() => setView(d => new Date(d.getFullYear(), d.getMonth() + 1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', color: '#64748b' }}>
            <Ic n="chevR" sz={13} />
          </button>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 5 }}>
          {DAY_LABELS.map(l => <div key={l} style={{ textAlign: 'center', fontSize: 10, color: '#334155', fontWeight: 700, padding: '3px 0' }}>{l}</div>)}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {days.map((key, i) => {
            if (!key) return <div key={`e${i}`} />
            const data = allDays[key]
            const score = calcScore(data)
            const pct = data ? (score / CONFIG.maxDailyScore) * 100 : null
            const status = pct !== null ? getDayStatus(pct) : null
            const col = status ? getDayColor(status) : null
            const active = hasDayActivity(data)
            const today = todayStr()
            const dayNum = Number(key.split('-')[2])
            const isT = key === today, isFuture = key > today, isSel = key === sel
            return (
              <div key={key} onClick={() => setSel(isSel ? null : key)} style={{
                aspectRatio: '1', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                background: isSel ? 'rgba(96,165,250,0.18)' : col ? col + '20' : 'rgba(255,255,255,0.025)',
                border: `1.5px solid ${isSel ? '#60a5fa' : isT ? 'rgba(96,165,250,0.45)' : col ? col + '45' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}>
                <div style={{ fontSize: 11, fontWeight: isT ? 700 : 500, color: isT ? '#60a5fa' : isFuture ? '#1e293b' : '#64748b' }}>{dayNum}</div>
                {active && !isFuture && <div style={{ fontSize: 9, fontWeight: 800, lineHeight: 1, color: col }}>{score}</div>}
              </div>
            )
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 10, padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Punkty miesiaca</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
              Max laduje sie codziennie: {monthProgressKeys.length} x {CONFIG.maxDailyScore} pkt
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#4ade80' }}>{monthProgressScore}</span>
            <span style={{ color: '#334155', fontSize: 15 }}>/{monthProgressMax}</span>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Tydzien', value: weekScore, unit: 'pkt', color: '#60a5fa' },
          { label: 'Miesiac', value: monthScore, unit: 'pkt', color: '#4ade80' },
          { label: 'Aktywne', value: monthActiveDays, unit: 'dni', color: '#fbbf24' },
        ].map(item => (
          <Card key={item.label} style={{ padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>{item.unit}</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Detail */}
      {!sel && <Card style={{ color: '#334155', fontSize: 13, textAlign: 'center', padding: '28px 16px' }}>Kliknij dzien, aby zobaczyc szczegoly</Card>}
      {sel && !selData && <Card style={{ color: '#334155', fontSize: 14 }}>Brak danych dla tego dnia.</Card>}
      {sel && selData && (() => {
        const col = getDayColor(selStatus)
        const wm = CONFIG.workModes.find(m => m.id === selData.workMode)
        return (
          <Card style={{ borderColor: col + '33' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
                  {new Date(sel + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div style={{ fontSize: 12, color: col, marginTop: 2 }}>{CONFIG.dayStatusLabels[selStatus]}</div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: col }}>{selScore}<span style={{ fontSize: 12, color: '#334155' }}>/{CONFIG.maxDailyScore}</span></div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {wm && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, background: wm.color + '12', color: wm.color, border: `1px solid ${wm.color}33` }}>{wm.label}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
              {CONFIG.tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: selData.completedTasks?.[t.id] ? '#4ade80' : '#1e293b' }}>{selData.completedTasks?.[t.id] ? '✓' : '○'}</span>
                  <span style={{ color: selData.completedTasks?.[t.id] ? '#94a3b8' : '#334155' }}>{t.emoji} {t.label}</span>
                </div>
              ))}
              {selData.trainings?.map(tid => {
                const tr = CONFIG.trainingOptions.find(x => x.id === tid)
                return tr ? (
                  <div key={tid} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: '#4ade80' }}>✓</span>
                    <span style={{ color: '#94a3b8' }}>{tr.emoji} {tr.label}</span>
                  </div>
                ) : null
              })}
            </div>

            {selData.note && (
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: '#64748b', marginBottom: 12, fontStyle: 'italic' }}>
                "{selData.note}"
              </div>
            )}

            <button onClick={() => onSelectDay(sel)} style={{ width: '100%', padding: '9px', borderRadius: 10, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', fontSize: 13 }}>
              Edytuj ten dzien →
            </button>
          </Card>
        )
      })()}
    </div>
  )
}
