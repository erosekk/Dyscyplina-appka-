'use client'
import { useState, useEffect, useCallback } from 'react'
import { getAllDays, saveDay, initDayData } from '@/lib/storage'

export function useDayData(selectedDate) {
  const [allDays, setAllDays] = useState({})

  useEffect(() => {
    setAllDays(getAllDays())
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

  return { dayData, setDayData, allDays }
}
