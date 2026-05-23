'use client'
import { useState, useEffect, useCallback } from 'react'
import { CONFIG } from '@/config'
import { todayStr, getWeekStart, getDayColor, getDayStatus, calcScore } from '@/lib/helpers'
import { getAllDays, saveDay, initDayData } from '@/lib/storage'
import { Ic } from '@/components/ui'
import DayView from '@/components/views/DayView'
import CalendarView from '@/components/views/CalendarView'
import StatsView from '@/components/views/StatsView'

const TABS = [
  { id: 'dashboard', label: 'Dzis',      icon: 'home'  },
  { id: 'calendar',  label: 'Kalendarz', icon: 'cal'   },
  { id: 'stats',     label: 'Postep',    icon: 'bars'  },
]

function Sidebar({ active, setActive, allDays }) {
  const t = todayStr()
  const score = calcScore(allDays[t])
  const pct = (score / CONFIG.maxDailyScore) * 100
  const status = getDayStatus(pct)
  const col = getDayColor(status)
  const ws = getWeekStart(t)
  let wCount = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws + 'T12:00:00'); d.setDate(d.getDate() + i)
    wCount += allDays[d.toISOString().slice(0, 10)]?.trainings?.length || 0
  }
  const r = 18, circ = 2 * Math.PI * r

  return (
    <aside style={{ width: 220, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflowY: 'auto', background: 'rgba(8,13,24,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '28px 22px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>Dyscyplina</div>
        <div style={{ fontSize: 11, color: '#1e293b', marginTop: 3 }}>Buduje swoje zycie porzadnie.</div>
      </div>

      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 10, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 10 }}>Dzisiejszy wynik</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
              <circle cx={24} cy={24} r={r} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round"
                strokeDasharray={`${circ * Math.min(pct / 100, 1)} ${circ}`} style={{ transition: 'stroke-dasharray 0.5s' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: col }}>{score}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: col }}>{CONFIG.dayStatusLabels[status]}</div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 3 }}>Treningi: {wCount}/{CONFIG.weeklyTrainingGoal}</div>
            <div style={{ fontSize: 10, color: '#334155' }}>{Math.round(pct)}% dnia</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, border: 'none', background: active === t.id ? 'rgba(96,165,250,0.1)' : 'transparent', color: active === t.id ? '#60a5fa' : '#475569', fontSize: 14, fontWeight: active === t.id ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
            <Ic n={t.icon} sz={15} /> {t.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '14px 22px', fontSize: 10, color: '#1e293b' }}>v1.0 · PWA</div>
    </aside>
  )
}

function BottomNav({ active, setActive }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(8,13,24,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', padding: '0 8px', paddingBottom: 'max(env(safe-area-inset-bottom,0px),8px)' }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{ flex: 1, padding: '11px 0 8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active === t.id ? '#60a5fa' : '#334155', transition: 'color 0.2s' }}>
          <Ic n={t.icon} sz={20} />
          <span style={{ fontSize: 10, fontWeight: active === t.id ? 600 : 400 }}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedDate, setSelectedDate] = useState(() => todayStr())
  const [allDays, setAllDays] = useState({})

  useEffect(() => {
    setAllDays(getAllDays())
    const fn = () => setIsDesktop(window.innerWidth >= 768)
    fn(); window.addEventListener('resize', fn)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    return () => window.removeEventListener('resize', fn)
  }, [])

  const dayData = allDays[selectedDate] || initDayData()
  const setDayData = useCallback((updater) => {
    setAllDays(prev => {
      const current = prev[selectedDate] || initDayData()
      const next = typeof updater === 'function' ? updater(current) : updater
      saveDay(selectedDate, next)
      return { ...prev, [selectedDate]: next }
    })
  }, [selectedDate])

  const ws = getWeekStart(selectedDate)
  let weeklyCount = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws + 'T12:00:00'); d.setDate(d.getDate() + i)
    weeklyCount += allDays[d.toISOString().slice(0, 10)]?.trainings?.length || 0
  }

  const handleSelectDay = key => { setSelectedDate(key); setActiveTab('dashboard') }

  const content = () => {
    if (activeTab === 'dashboard') return <DayView dayData={dayData} setDayData={setDayData} selectedDate={selectedDate} setSelectedDate={setSelectedDate} allDays={allDays} weeklyCount={weeklyCount} />
    if (activeTab === 'calendar')  return <CalendarView allDays={allDays} onSelectDay={handleSelectDay} />
    if (activeTab === 'stats')     return <StatsView allDays={allDays} />
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#080d18', color: '#e2e8f0', display: isDesktop ? 'flex' : 'block' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 100% 55% at 50% -5%, rgba(20,40,120,0.28) 0%, transparent 65%)' }} />
      {isDesktop && <Sidebar active={activeTab} setActive={setActiveTab} allDays={allDays} />}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: isDesktop ? '0 24px 44px' : '0 16px 88px' }}>
          {content()}
        </div>
      </main>
      {!isDesktop && <BottomNav active={activeTab} setActive={setActiveTab} />}
    </div>
  )
}
