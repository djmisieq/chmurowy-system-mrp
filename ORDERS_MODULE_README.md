# Rozbudowa modułu zamówień i powiązanie z produkcją

## Wprowadzenie

Ten dokument opisuje zmiany wprowadzone w ramach rozbudowy modułu zamówień oraz powiązania go z modułem produkcji w aplikacji Chmurowy System MRP.

## Zmiany obejmują

### 1. Komponenty dla modułu zamówień:
- Dodanie komponentów do wyświetlania statystyk (`StatsCard`)
- Dodanie komponentów nawigacyjnych (`NavCard`)
- Dodanie komponentu przeglądu zamówień (`OrdersOverview`)
- Dodanie komponentu listy ostatnich zamówień (`RecentOrders`)

### 2. Dane mockowane:
- Dodanie danych dla zamówień klientów
- Dodanie danych dla zamówień do dostawców
- Dodanie danych dla zleceń produkcyjnych
- Dodanie powiązań między zamówieniami a produkcją

### 3. Strony modułu zamówień:
- Rozbudowa głównej strony modułu zamówień
- Dodanie podstrony z listą zamówień klientów
- Dodanie podstrony z listą zamówień do dostawców
- Dodanie podstrony planowania zakupów

### 4. Powiązanie z modułem produkcji:
- Aktualizacja strony modułu produkcji
- Dodanie powiązań między zamówieniami klientów a zleceniami produkcyjnymi
- Prezentacja zleceń produkcyjnych z odniesieniami do zamówień

## Struktura modułu zamówień

```
src/app/orders/
├── page.tsx                  # Strona główna modułu zamówień (przegląd)
├── sales/
│   └── page.tsx              # Lista zamówień klientów
├── purchase/
│   └── page.tsx              # Lista zamówień do dostawców
└── planning/
    └── page.tsx              # Planowanie zakupów

src/components/orders/
├── StatsCard.tsx             # Komponent karty statystyk
├── NavCard.tsx               # Komponent karty nawigacyjnej
├── OrdersOverview.tsx        # Komponent przeglądu zamówień
├── RecentOrders.tsx          # Komponent listy ostatnich zamówień
├── mockData.ts               # Podstawowe typy i statystyki
├── mockCustomerOrders.ts     # Dane mockowane zamówień klientów
├── mockPurchaseOrders.ts     # Dane mockowane zamówień do dostawców
└── mockProductionOrders.ts   # Dane mockowane zleceń produkcyjnych
```

## Powiązania z modułem produkcji

Moduł zamówień jest powiązany z modułem produkcji poprzez:
1. Odniesienia z zamówień klientów do zleceń produkcyjnych
2. Odniesienia ze zleceń produkcyjnych do zamówień klientów
3. Moduł planowania zakupów, który analizuje potrzeby produkcyjne

## Zrzuty ekranu

![Moduł zamówień - główna strona](/screenshots/orders-main.png)
![Moduł zamówień - lista zamówień klientów](/screenshots/orders-sales.png)
![Moduł zamówień - planowanie zakupów](/screenshots/orders-planning.png)
![Moduł produkcji z powiązaniami](/screenshots/production-main.png)

## Technologie

- React.js / Next.js (App Router)
- TypeScript
- TailwindCSS
- Lucide React (ikony)

## Planowane przyszłe rozbudowy:
- Dodanie formularzy do dodawania/edycji zamówień
- Dodanie stron szczegółów zamówień
- Implementacja mechanizmu tworzenia zleceń produkcyjnych z zamówień
- Rozbudowa modułu produkcji o planowanie, harmonogramowanie i realizację