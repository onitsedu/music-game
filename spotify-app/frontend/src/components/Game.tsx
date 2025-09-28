import { useRef, useState } from 'react'

import { PlaylistResponse, Track, useGetPlaylistTracksQuery } from '../services/spotifyApi'
import SpinWheel, { SpinWheelRef, WheelItem } from './SpinWheel';
import SpotifyPlayer from './SpotifyPlayer';
import TrackCard from './TrackCard';
import Button from '@mui/material/Button';
import { Alert, Box, CircularProgress, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';


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
  const [openModal, setOpenModal] = useState(false);
  const [winnerItem, setWinnerItem] = useState<WheelItem | null>(null);


  const limit = 50;
  const { data, error, isLoading } = useGetPlaylistTracksQuery({
    id,
    limit: 150,
    offset: 0,
    token: accessToken
  })

  const [page, setPage] = useState(0)

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="black"
      >
        <CircularProgress size={60} sx={{ color: "#1DB954" }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">Error cargando la playlist</Alert>
      </Box>
    )
  }
  if (!data) return null

  const handleOnResult = (item: WheelItem) => {

    setWinnerItem(item);
    setOpenModal(true); setReproduce(true);
    const randomId = Math.floor(Math.random() * data.tracks.items.length)
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
        (<div className='wheel-wrapper'>
          <div className='wheel-container'>
            <SpinWheel onClick={spin} ref={wheelRef} size={500} items={easy} onResult={handleOnResult} ></SpinWheel>
          </div>
          {/* <div className='spin-container'>
            <Button sx={{ marginTop: '25px' }} variant="contained" color="secondary" onClick={spin} >Girar</Button>
          </div> */}
        </div>)
      }
      {reproduce && <SpotifyPlayer token={accessToken || ''} trackId={trackId}></SpotifyPlayer>}
      {actualTrack && <button onClick={() => setShowTrack(true)} >Mostrar resultado</button>}
      {actualTrack && showTrack && <TrackCard track={actualTrack} />}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          {winnerItem && (
            <Typography variant="h6" sx={{ color: winnerItem.color, fontWeight: 'bold' }}>
              Winner: {winnerItem.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenModal(false)}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}