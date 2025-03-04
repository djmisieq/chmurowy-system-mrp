# Chmurowy System MRP

Chmurowy System MRP dla firmy produkującej łodzie motorowodne - frontend aplikacji oparty o React.js/Next.js.

## Cele projektu

Stworzenie chmurowego systemu MRP (Material Requirements Planning) dla firmy zajmującej się produkcją łodzi motorowodnych. 

## Architektura

W pierwszej fazie projektu skupiamy się wyłącznie na frontendzie z wykorzystaniem:

- **Next.js** - framework React do budowy interfejsu użytkownika
- **Tailwind CSS** - dla stylowania
- **JSON Server** - do mockowania API
- **React Query** - do zarządzania stanem i cachingiem danych
- **Zustand** - prosty manager stanu

## Uruchomienie projektu

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Uruchomienie mockowanego API
npm run mock-api
```

## Struktura projektu

- `src/app`: Komponenty stron aplikacji (App Router)
- `src/components`: Podzielone na komponenty współdzielone i komponenty specyficzne dla funkcjonalności
- `src/types`: Typy TypeScript
- `src/services`: Komunikacja z API
- `src/hooks`: Custom hooks
- `src/store`: Zustand store 
- `mock-api`: Dane dla JSON Server

## Faza MVP

Pierwszy etap projektu zakłada stworzenie podstawowego UI z wykorzystaniem mockowanych danych, obejmującego:

- Panel główny z kluczowymi wskaźnikami
- Zarządzanie magazynem
- Zarządzanie zamówieniami
- Podstawowe planowanie produkcji
