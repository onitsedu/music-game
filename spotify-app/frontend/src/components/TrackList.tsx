import { useState } from 'react'

import { PlaylistResponse, Track, useGetPlaylistTracksQuery } from '../services/spotifyApi'


interface Props {
  accessToken?: string | null,
  id: string | undefined
}

export default function TrackList({ accessToken, id }: Props) {
  const limit = 50;
  const { data, error, isLoading } = useGetPlaylistTracksQuery({
    id,
    limit: 150,
    offset: 0,
    token: accessToken
  })

  const [page, setPage] = useState(0)

  if (isLoading) return <p>Cargando…</p>
  if (error) return <p>Error cargando la playlist</p>
  if (!data) return null

  return (
    <div className="space-y-4">
      {data.tracks.items.map(({ track }) => (

        <div key={track.id} className="flex items-center space-x-4 p-2 border rounded">
          <img src={track.album.images[0]?.url} alt="cover" className="w-12 h-12" />
          <div className="flex-1">
            <p className="font-bold">{track.name}</p>
            <p className="font-bold">{`Fecha: ${track.album.release_date}`}</p>
            <p className="text-sm text-gray-600">{track.artists.map(a => a.name).join(', ')}</p>
          </div>
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            Abrir en Spotify
          </a>
        </div>
      ))}


      <div className="flex space-x-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          disabled={data.tracks.items.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}