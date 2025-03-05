# Chmurowy System MRP

## Opis Projektu
System MRP (Material Requirements Planning) dla firmy produkującej łodzie motorowodne, zbudowany w oparciu o nowoczesne technologie webowe.

## Technologie
- Frontend: React.js / Next.js
- Styling: Tailwind CSS
- Ikony: Lucide React
- Zarządzanie stanem: React Hooks
- Środowisko developmentu: GitHub Codespaces

## Główne Założenia
- Iteracyjne podejście do rozwoju (MVP)
- Priorytet na frontend w pierwszej fazie
- Responsywny, minimalistyczny interfejs
- Łatwe zarządzanie procesami produkcyjnymi

## Struktura Projektu
- `src/components/` - Komponenty React
- `src/app/` - Strony aplikacji (Next.js App Router)
- `src/hooks/` - Niestandardowe hooki React
- `src/store/` - Zarządzanie stanem aplikacji (Zustand)
- `mock-api/` - Mockowane API dla testowania

## Uruchomienie Projektu
1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Uruchom serwer deweloperski i mock API: `npm run dev:all`

## Uwagi dla Next.js App Router
1. Komponenty używające hooków React (np. useState, useEffect) muszą zawierać dyrektywę `"use client";` na początku pliku
2. Domyślnie wszystkie komponenty w Next.js 13+ są komponentami serwerowymi
3. Dodaj bibliotekę lucide-react jeśli nie jest zainstalowana: `npm install lucide-react`

## Plan Rozwoju
- [x] Inicjalizacja projektu
- [x] Utworzenie podstawowego dashboardu
- [x] Integracja z mock API
- [ ] Implementacja modułu zamówień
- [ ] Dodanie systemu powiadomień

## Autor
Dariusz Misięk (@djmisieq)

## Licencja
Projekt jest na licencji MIT
