'use client'
import { useState } from 'react'
import { CONFIG } from '@/config'
import { calcScore, getDayColor, getDayStatus, todayStr, getWeekKeys, DAY_LABELS } from '@/lib/helpers'
import { Card, SectionLabel, Ic, ScoreRing } from '@/components/ui'

const TaskRow = ({ task, done, onToggle, optional }) => (
  <div onClick={onToggle} style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
    background: done ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${done ? 'rgba(74,222,128,0.22)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
    opacity: optional ? 0.4 : 1,
  }}>
    <div style={{
      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
      border: `2px solid ${done ? '#4ade80' : 'rgba(255,255,255,0.18)'}`,
      background: done ? '#4ade80' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', transition: 'all 0.2s',
    }}>
      {done && <Ic n="check" sz={11} />}
    </div>
    <span style={{ fontSize: 17 }}>{task.emoji}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: done ? '#64748b' : '#e2e8f0', textDecoration: done ? 'line-through' : 'none' }}>{task.label}</div>
      <div style={{ fontSize: 11, color: '#2d3748', marginTop: 1 }}>{task.isMinimum ? 'minimum' : 'bonus'} · {task.pts} pkt{optional ? ' · opcjonalne' : ''}</div>
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: done ? '#4ade80' : '#2d3748' }}>+{task.pts}</div>
  </div>
)

const WeekMini = ({ allDays, selectedDate, onDayClick }) => {
  const days = getWeekKeys(selectedDate).map(key => ({ key, data: allDays[key] }))
  const weeklyScore = days.reduce((total, day) => total + calcScore(day.data), 0)
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <SectionLabel>Postep tygodnia</SectionLabel>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>{weeklyScore} pkt</div>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {days.map(({ key, data }, i) => {
          const score = calcScore(data), pct = (score / CONFIG.maxDailyScore) * 100
          const status = data ? getDayStatus(pct) : null
          const col = status ? getDayColor(status) : null
          const isT = key === todayStr(), isFuture = key > todayStr(), isSel = key === selectedDate
          return (
            <div key={key} onClick={() => onDayClick(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <div style={{ fontSize: 10, color: isT ? '#60a5fa' : '#334155', fontWeight: isT ? 700 : 400 }}>{DAY_LABELS[i]}</div>
              <div style={{
                width: '100%', aspectRatio: '1', borderRadius: 8,
                background: col ? col + '28' : 'rgba(255,255,255,0.025)',
                border: `1.5px solid ${isSel ? '#60a5fa' : isT ? 'rgba(96,165,250,0.35)' : col ? col + '50' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1,
              }}>
                {score > 0 && !isFuture && <span style={{ fontSize: 10, fontWeight: 800, color: col }}>{score}</span>}
                {isT && !data && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#60a5fa' }} />}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function DayView({ dayData, setDayData, selectedDate, setSelectedDate, allDays, weeklyCount }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const isLong = dayData.workMode === 'work7'
  const score = calcScore(dayData)
  const pct = (score / CONFIG.maxDailyScore) * 100
  const status = getDayStatus(pct)
  const col = getDayColor(status)
  const minimumDone = CONFIG.tasks.filter(t => t.isMinimum).every(t => dayData.completedTasks?.[t.id])
  const t = todayStr(), isToday = selectedDate === t
  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
  const missingTrainings = Math.max(CONFIG.weeklyTrainingGoal - weeklyCount, 0)

  const toggle = id => setDayData(p => ({ ...p, completedTasks: { ...p.completedTasks, [id]: !p.completedTasks?.[id] } }))
  const toggleTrain = id => setDayData(p => {
    const has = p.trainings?.includes(id)
    return { ...p, trainings: has ? p.trainings.filter(x => x !== id) : [...(p.trainings || []), id] }
  })
  const navDay = dir => { const d = new Date(selectedDate + 'T12:00:00'); d.setDate(d.getDate() + dir); setSelectedDate(d.toISOString().slice(0, 10)) }

  const navBtn = (dir) => (
    <button onClick={() => navDay(dir)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 10px', color: '#64748b' }}>
      <Ic n={dir < 0 ? 'chevL' : 'chevR'} sz={14} />
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 0 6px' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.4px' }}>{isToday ? 'Dzisiaj' : dateLabel}</div>
          {isToday && <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>{dateLabel}</div>}
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {navBtn(-1)}
          <button onClick={() => setSelectedDate(t)} style={{ background: isToday ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isToday ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '5px 11px', color: isToday ? '#60a5fa' : '#64748b', fontSize: 12 }}>Dzis</button>
          {navBtn(1)}
        </div>
      </div>

      {/* Work mode */}
      <Card>
        <SectionLabel>Tryb dnia</SectionLabel>
        <div style={{ display: 'flex', gap: 6 }}>
          {CONFIG.workModes.map(m => (
            <button key={m.id} onClick={() => setDayData(p => ({ ...p, workMode: m.id }))} style={{
              flex: 1, padding: '8px 4px', borderRadius: 10,
              border: `1px solid ${dayData.workMode === m.id ? m.color + '44' : 'rgba(255,255,255,0.07)'}`,
              background: dayData.workMode === m.id ? m.color + '12' : 'rgba(255,255,255,0.02)',
              color: dayData.workMode === m.id ? m.color : '#475569',
              fontSize: 12, fontWeight: dayData.workMode === m.id ? 600 : 400, transition: 'all 0.2s',
            }}>{m.short}</button>
          ))}
        </div>
        {isLong && (
          <div style={{ marginTop: 8, padding: '9px 13px', borderRadius: 10, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)', fontSize: 12, color: '#fbbf24' }}>
            Dzisiaj liczy sie minimum. Bez cisnienia na perfekcje.
          </div>
        )}
      </Card>

      {/* Score */}
      <Card style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        <ScoreRing score={score} maxScore={CONFIG.maxDailyScore} color={col} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: col, letterSpacing: '-0.3px' }}>{CONFIG.dayStatusLabels[status]}</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{CONFIG.dayCopyMap[status]}</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: minimumDone ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', color: minimumDone ? '#4ade80' : '#334155', border: `1px solid ${minimumDone ? 'rgba(74,222,128,0.22)' : 'rgba(255,255,255,0.07)'}` }}>
              {minimumDone ? 'Minimum dnia' : 'Minimum dnia'}
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.04)', color: '#475569', border: '1px solid rgba(255,255,255,0.07)' }}>
              {Math.round(pct)}% dnia
            </span>
          </div>
        </div>
      </Card>

      {/* Tasks */}
      <div>
        <SectionLabel>Zadania na dzis</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CONFIG.tasks.map(task => (
            <TaskRow key={task.id} task={task} done={!!dayData.completedTasks?.[task.id]}
              onToggle={() => toggle(task.id)} optional={isLong && !task.isMinimum} />
          ))}
        </div>
      </div>

      {/* Training */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <SectionLabel>Treningi tygodnia</SectionLabel>
            <div style={{ fontSize: 12, color: '#475569', marginTop: -4 }}>
              {weeklyCount >= CONFIG.weeklyTrainingGoal ? 'Cel tygodnia zrobiony' : `Brakuje ${missingTrainings} do celu`}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: weeklyCount >= CONFIG.weeklyTrainingGoal ? '#4ade80' : '#60a5fa' }}>{weeklyCount}/{CONFIG.weeklyTrainingGoal}</div>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, marginBottom: 12 }}>
          <div style={{ height: '100%', width: `${Math.min((weeklyCount / CONFIG.weeklyTrainingGoal) * 100, 100)}%`, background: 'linear-gradient(90deg,#60a5fa,#4ade80)', borderRadius: 99, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {CONFIG.trainingOptions.map(tr => {
            const done = dayData.trainings?.includes(tr.id)
            return (
              <button key={tr.id} onClick={() => toggleTrain(tr.id)} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10,
                border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.09)'}`,
                background: done ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                color: done ? '#4ade80' : '#64748b', fontSize: 12,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <span style={{ fontSize: 18 }}>{tr.emoji}</span>
                <span>{tr.label}</span>
                <span style={{ fontSize: 10, color: done ? '#4ade80' : '#334155' }}>+{tr.pts} pkt</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Note */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionLabel>Notatka dnia</SectionLabel>
          <button onClick={() => setNoteOpen(p => !p)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: 14, padding: 0 }}>✏️</button>
        </div>
        {(noteOpen || dayData.note) ? (
          <textarea value={dayData.note || ''} onChange={e => setDayData(p => ({ ...p, note: e.target.value }))}
            placeholder="Co sie dzialo dzis? Jak minął dzien?"
            style={{ width: '100%', minHeight: 80, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.5, marginTop: 8 }} />
        ) : (
          <div onClick={() => setNoteOpen(true)} style={{ fontSize: 12, color: '#334155', marginTop: 4, cursor: 'pointer' }}>
            Kliknij zeby dodac notatke...
          </div>
        )}
      </Card>

      {/* Skip reason */}
      {status === 'weak' && (
        <Card style={{ borderColor: 'rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' }}>
          <SectionLabel>Powod pominiecia</SectionLabel>
          <input value={dayData.skipReason || ''} onChange={e => setDayData(p => ({ ...p, skipReason: e.target.value }))}
            placeholder="Co Cie zatrzymalo?"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
          <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>Jutro wracasz do minimum.</div>
        </Card>
      )}

      <WeekMini allDays={allDays} selectedDate={selectedDate} onDayClick={setSelectedDate} />
    </div>
  )
}
