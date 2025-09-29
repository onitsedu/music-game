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
    setOpenModal(true);

    const randomId = Math.floor(Math.random() * data.tracks.items.length)
    console.log(randomId)
    const track = data.tracks.items[randomId].track;
    //data.tracks.items.splice(trackId, 1);
    setTrackId(track.id)
    setActualTrack(track)
  }

  const handleAccept = () => {
    setOpenModal(false)
    setReproduce(true);
  }


  const spin = () => {
    setShowTrack(false)
    wheelRef.current?.spin();

  }

  const newTurn = () => {
    setReproduce(false);
    setActualTrack(undefined);

  }

  return (
    <div className="space-y-4">
      <div className='game-wrapper'>
        {data && !reproduce &&
          (<div className='wheel-wrapper'>
            <div className='wheel-container'>
              <SpinWheel onClick={spin} ref={wheelRef} size={500} items={easy} onResult={handleOnResult} ></SpinWheel>
            </div>
            {/* <div className='spin-container'>
            <Button sx={{ marginTop: '25px' }} variant="contained" color="secondary" onClick={spin} >Girar</Button>
          </div> */}
          </div>)
        }
        {reproduce && (
          <div className='player-container'>
            <SpotifyPlayer token={accessToken || ''} trackId={trackId}></SpotifyPlayer>
          </div>)}
        {actualTrack && showTrack && (
          <div className='track-container'>
            <TrackCard track={actualTrack} />
          </div>)}
        {actualTrack && !showTrack && (
          <div className='show-result-container'>
            <Button
              variant="contained"
              sx={{
                margin: '25px',
                backgroundColor: "#1DB954",
                color: "black",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1ed760" },
              }}
              onClick={() => setShowTrack(true)}
            >        Mostrar resultado      </Button></div>
        )}
        {actualTrack && showTrack && (
          <div className='show-result-container'>
            <Button
              variant="contained"
              sx={{
                margin: '25px',
                backgroundColor: "#1DB954",
                color: "black",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1ed760" },
              }}
              onClick={newTurn}
            >        Nuevo turno      </Button></div>
        )}
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent sx={{ backgroundColor: winnerItem?.color, color: 'white', fontWeight: 'bold' }}>
          {winnerItem && (
            <Typography variant="h6" sx={{ backgroundColor: winnerItem.color, color: 'white', fontWeight: 'bold' }}>
              Winner: {winnerItem.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: winnerItem?.color, color: 'white', fontWeight: 'bold' }}>
          <Button sx={{ backgroundColor: 'black' }} variant="contained" onClick={handleAccept}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}