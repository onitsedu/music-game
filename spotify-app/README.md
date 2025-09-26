# Spotify Playlist Viewer (React + TypeScript + Tailwind + Redux Toolkit + Express)

## Qué hace
- Flow OAuth con Spotify (backend seguro con client_secret).
- Frontend para introducir una playlist (URL o ID).
- Muestra pista: nombre, artistas, autor (primer artista del álbum), duración, miniatura y enlace a Spotify.
- Paginación usando `limit` y `offset`.

## Uso (desarrollo)
1. Copia `.env.example` a `.env` en la carpeta `backend/` y rellena `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET`.
2. Desde `backend/`: `npm install` y `npm run dev` (usa `PORT=4000` si quieres).
3. Desde `frontend/`: `npm install` y `npm run dev` (Vite corre en 5173).
4. Abre `http://localhost:5173`, pulsa "Conectar con Spotify" y autoriza.
