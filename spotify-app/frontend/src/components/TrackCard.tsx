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
    year: "numeric"
  }).format(date)

  // Coger la portada más grande disponible
  const coverImage = track.album.images[0]?.url ?? ""

  return (
    <section className="card-section">
      <div >
        <h1 >{track.name} - {formattedDate} - {artists}</h1>
      </div>
      <div>
        {coverImage && <img src={coverImage} alt={`Portada del álbum de ${track.name}`} />}
      </div>
    </section>
  )
}

export default TrackCard
