# Dyscyplina — PWA

Osobisty tracker dyscypliny. Buduje swoje zycie porzadnie.

**Stack:** Next.js 14 · Tailwind CSS · localStorage · PWA

---

## Szybki start

```bash
npm install
npm run dev
```

Otworz http://localhost:3000

## Build + deploy na Vercel

```bash
npm run build
```

Lub podlacz repozytorium GitHub do vercel.com — deploy automatycznie.

---

## Instalacja na telefonie (PWA)

### iPhone (Safari):
1. Otworz aplikacje w Safari
2. Kliknij ikone udostepniania
3. "Dodaj do ekranu glownego"
4. Gotowe — ikona jak prawdziwa apka

### Android (Chrome):
1. Otworz w Chrome
2. Menu → "Dodaj do ekranu glownego"

---

## Jak edytowac zadania i punkty

Edytuj `src/config/index.js`:

```js
tasks: [
  { id: 'water', label: '2L wody', pts: 2, emoji: 'drop', isMinimum: true },
  // dodaj wlasne zadanie:
  { id: 'meditation', label: 'Medytacja 10 min', pts: 2, emoji: 'moon', isMinimum: false },
]
```

---

## Struktura projektu

```
src/
  app/          # Next.js app router
  components/
    ui/         # Atomy: Card, Ic, ScoreRing
    views/      # DayView, CalendarView, StatsView
  config/       # Zadania, punkty, tryby pracy
  hooks/        # useDayData, useIsDesktop
  lib/
    helpers.js  # Funkcje pomocnicze
    storage.js  # localStorage wrapper (gotowe na Supabase)
public/
  manifest.json # PWA manifest
  sw.js         # Service Worker (offline)
  icons/        # Ikony apki
```

---

## Migracja do Supabase (przyszlosc)

Cala logika zapisu jest w `src/lib/storage.js`.
Zamien funkcje `getAllDays`, `saveDay`, `getWeightLog`, `saveWeightEntry`
na wywolania Supabase — reszta aplikacji nie wymaga zmian.

---

## GitHub

```bash
git init
git add .
git commit -m "Dyscyplina PWA v1"
git remote add origin https://github.com/TWOJA_NAZWA/dyscyplina.git
git push -u origin main
```
