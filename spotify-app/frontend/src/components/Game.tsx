import { useRef, useState } from 'react'

import { PlaylistResponse, Track, useGetPlaylistTracksQuery } from '../services/spotifyApi'
import SpinWheel, { SpinWheelRef, WheelItem } from './SpinWheel';
import SpotifyPlayer from './SpotifyPlayer';
import TrackCard from './TrackCard';


interface Props {
  accessToken?: string | null,
  id: string | undefined
}
const easy = [
  { id: 1, name: "Año Exacto", color: "#e74c3c" },
  { id: 2, name: "Decada", color: "#3498db" },
  { id: 3, name: "Nombre de la canción", color: "#2ecc71" },
  { id: 4, name: "Año +- 3", color: "#f1c40f" },
  { id: 5, name: "Artista", color: "#bc0ff1ff" },
];


export default function Game({ accessToken, id }: Props) {
  const wheelRef = useRef<SpinWheelRef>(null);
  const [reproduce, setReproduce] = useState<boolean>(false)
  const [trackId, setTrackId] = useState<string>('')
  const [actualTrack, setActualTrack] = useState<Track | undefined>(undefined)
  const [showTrack, setShowTrack] = useState(false)


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

  const handleOnResult = (item: WheelItem) => {

    alert('Winner ' + item.name)
    setReproduce(true);
    const randomId = Math.floor(Math.random() * data.tracks.items.length) + 1
    console.log(randomId)
    const track = data.tracks.items[randomId].track;
    //data.tracks.items.splice(trackId, 1);
    setTrackId(track.id)
    setActualTrack(track)
  }

  const spin = () => {
    setShowTrack(false)
    wheelRef.current?.spin();

  }



  return (
    <div className="space-y-4">
      {data &&
        (<div>
          <SpinWheel ref={wheelRef} size={500} items={easy} onResult={handleOnResult} ></SpinWheel>
          <button onClick={spin} className="px-4 py-2 bg-blue-500 text-white rounded">Girar</button>
        </div>)
      }
      {reproduce && <SpotifyPlayer token={accessToken || ''} trackId={trackId}></SpotifyPlayer>}
      {actualTrack && <button onClick={() => setShowTrack(true)} className="px-4 py-2 bg-blue-500 text-white rounded">Mostrar resultado</button>}
      {actualTrack && showTrack && <TrackCard track={actualTrack} />}

    </div>
  )
}