import React from "react"
import { Track } from "../services/spotifyApi"

type TrackCardProps = {
  track: Track
  fullScreen?: boolean
}

const TrackCard: React.FC<TrackCardProps> = ({ track, fullScreen = true }) => {
  const artists = track.artists.map((a) => a.name).join(", ")
  const date = new Date(track.album.release_date)

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date)

  // Coger la portada más grande disponible
  const coverImage = track.album.images[0]?.url ?? ""

  return (
    <section
      className={`relative bg-black text-white ${
        fullScreen ? "min-h-screen" : ""
      } flex items-center justify-center p-4`}
      aria-label={`Información del track ${track.name} por ${artists}`}
    >
      {/* Fondo con portada */}
      {coverImage && (
        <img
          src={coverImage}
          alt={`Portada del álbum de ${track.name}`}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Contenido */}
      <div className="relative text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold">{track.name}</h1>
        <p className="text-lg md:text-xl opacity-80 mt-2">{formattedDate}</p>
        <p className="text-xl md:text-2xl mt-3 font-medium">{artists}</p>
      </div>
    </section>
  )
}

export default TrackCard
