// ============================================================
// CONFIG — edytuj tutaj zadania, punkty, tryby pracy
// ============================================================
export const CONFIG = {
  weeklyTrainingGoal: 3,
  workModes: [
    { id: 'free',  label: 'Wolne',            short: 'Wolne', color: '#4ade80' },
    { id: 'work8', label: 'Praca 8:00–16:00', short: '8–16',  color: '#60a5fa' },
    { id: 'work7', label: 'Praca 7:00–19:00', short: '7–19',  color: '#f59e0b' },
  ],
  dayStatusThresholds: { win: 80, solid: 60, average: 35 },
  dayStatusLabels: {
    win: 'Wygrałeś dzień', solid: 'Solidny dzień',
    average: 'Średnj dzień', chaotic: 'Chaotyczny dzień',
  },
  dayCopyMap: {
    win: 'Dzień zapisany. Lecimy dalej.',
    solid: 'Dobra robota. Jutro jeszcze lepiej.',
    average: 'Dzisiaj zabrakło struktury.',
    chaotic: 'Jutro wracasz do minimum.',
  },
  tasks: [
    { id: 'water',   label: '2L wody',                    category: 'zdrowie', pts: 2, emoji: '💧', isMinimum: true  },
    { id: 'stretch', label: 'Rozciąganie 5–10 min',      category: 'zdrowie', pts: 1, emoji: '🧘', isMinimum: true  },
    { id: 'sleep',   label: 'Sen około 23:00',            category: 'zdrowie', pts: 3, emoji: '🌙', isMinimum: false },
    { id: 'lang',    label: 'Nauka języka (min. 20 min)', category: 'rozwój',  pts: 3, emoji: '🗣️', isMinimum: true  },
    { id: 'reading', label: '20 stron książki',          category: 'rozwój',  pts: 3, emoji: '📖', isMinimum: true  },
    { id: 'ai',      label: 'AI / projekty',              category: 'rozwój',  pts: 3, emoji: '🧠', isMinimum: false },
  ],
  trainingOptions: [
    { id: 'gym',  label: 'Siłownia',       emoji: '🏋️', pts: 5 },
    { id: 'swim', label: 'Basen',          emoji: '🏊',  pts: 5 },
    { id: 'home', label: 'Trening domowy', emoji: '🏠', pts: 3 },
  ],
  maxDailyScore: 20,
  weightLogIntervalDays: 14,
}
