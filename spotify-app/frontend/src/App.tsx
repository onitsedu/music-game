import React, { useEffect, useRef, useState } from 'react'
import LoginButton from './components/LoginButton'
import TrackList from './components/TrackList'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import axios from 'axios'
import { useAppDispatch } from './hooks'
import { setTokens } from './features/auth/authSlice'
import SpinWheel, { SpinWheelRef, WheelItem } from './components/SpinWheel'
import Game from './components/Game'
import { Track } from './services/spotifyApi'

export default function App() {
  const auth = useSelector((s: RootState) => s.auth)
  const [value, setValue] = useState('')
  const [load, setLoad] = useState<boolean>(false)


  const handleResult = (item: WheelItem) => {
    alert("Ganador: " + item.name);
  };

  const dispatch = useAppDispatch()

  useEffect(() => {
    axios.get('/auth/session').then(res => {
      if (res.data?.accessToken) {
        dispatch(setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, expiresAt: res.data.expiresAt }))
      } else {
        // try to read tokens from url query (callback)
        const params = new URLSearchParams(window.location.search)
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        const expires_in = params.get('expires_in')
        if (access_token) {
          const expiresAt = expires_in ? Date.now() + Number(expires_in) * 1000 : null
          dispatch(setTokens({ accessToken: access_token, refreshToken: refresh_token, expiresAt }))
        }
      }
    }).catch(() => { })
  }, [dispatch])

  // capture current playlist id for TrackList pagination buttons
  useEffect(() => {
    (window as any).__CURRENT_PLAYLIST_ID = null
    const input = document.querySelector('input')
    if (input) {
      input.addEventListener('change', () => {
        const val = (input as HTMLInputElement).value
        const parts = val.split('/');
        const last = parts.pop();
        const id = last ? last.split('?')[0] : val;
        (window as any).__CURRENT_PLAYLIST_ID = id
      })
    }
  }, [])

  const submit = () => {

    setLoad(true)
  }


  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Spotify Playlist Viewer</h1>
        {!auth.accessToken ? <LoginButton /> : <div className="text-sm">Conectado</div>}
        {auth.accessToken && !load && (
          <div>
            <input className="border p-2 rounded flex-1" placeholder="4JeXxiGl8TuceQx0hj8xpq" value={value} onChange={e => setValue(e.target.value)} />
            <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">Cargar</button>
          </div>)}
      </header>
      <main>
        {auth.accessToken && value && load && <Game id={value} accessToken={auth.accessToken} />}
      </main>

    </div>
  )

}
//4JeXxiGl8TuceQx0hj8xpq