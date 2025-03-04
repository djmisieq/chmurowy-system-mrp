# Chmurowy System MRP

System planowania zasobów materiałowych (MRP) dla firmy zajmującej się produkcją łodzi motorowodnych.

## Uruchomienie projektu w GitHub Codespaces

### Automatyczne uruchomienie
1. Przejdź do repozytorium na GitHub
2. Kliknij zielony przycisk "Code"
3. Wybierz zakładkę "Codespaces"
4. Kliknij "Create codespace on main"

### Po otwarciu Codespaces

1. **Uruchomienie aplikacji**:
   ```bash
   npm run dev
   ```

2. **Uruchomienie mockowego API** (w osobnym terminalu):
   ```bash
   npm run mock-api
   ```

3. **Dostęp do aplikacji**:
   - W zakładce "PORTS" znajdź port 3000
   - Kliknij ikonę "globe" (świata) obok portu 3000, aby otworzyć aplikację w przeglądarce
   - Możesz również użyć "Open in browser" z menu kontekstowego portu

### Rozwiązywanie problemów

Jeśli strona wyświetla błąd 502:

1. Zatrzymaj serwer (Ctrl+C) i uruchom ponownie:
   ```bash
   npm run dev
   ```

2. Upewnij się, że port 3000 jest otwarty i publiczny:
   - W zakładce "PORTS" kliknij prawym przyciskiem myszy na port 3000
   - Wybierz "Port Visibility" -> "Public"

3. Odśwież stronę w przeglądarce

### Struktura projektu

- `src/app`: Komponenty stron aplikacji (App Router)
- `src/components`: Komponenty UI
- `src/store`: Stan aplikacji (Zustand)
- `src/services`: Komunikacja z API
- `src/hooks`: Custom hooks
- `src/types`: Typy TypeScript
- `mock-api`: Dane dla JSON Server

## Technologie

- Next.js / React.js
- Tailwind CSS
- TypeScript
- JSON Server (mockowane API)
- Zustand (stan aplikacji)

## Faza projektu

Aktualnie projekt jest w fazie MVP koncentrującej się na frontendzie. Backend zostanie dodany w późniejszym etapie.
