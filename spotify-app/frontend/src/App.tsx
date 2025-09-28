import React, { useEffect, useState } from 'react'
import LoginButton from './components/LoginButton'
import Game from './components/Game'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import axios from 'axios'
import { useAppDispatch } from './hooks'
import { setTokens } from './features/auth/authSlice'
import TextField from '@mui/material/TextField'
import PlaylistForm from './components/PlaylistForm'

export default function App() {
  const auth = useSelector((s: RootState) => s.auth)
  const [value, setValue] = useState('')
  const [load, setLoad] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    axios.get('/auth/session').then(res => {
      if (res.data?.accessToken) {
        dispatch(setTokens({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          expiresAt: res.data.expiresAt
        }))
      } else {
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

  const submit = (id: string) => {
    setValue(id)
    setLoad(true)
  }
  return (
    <div className="bg-black main-container" >
      <h1 >Spotify Roulette App</h1>
      {!auth.accessToken ? (
        <div className='login-container'>
          <img
            src="https://developer-assets.spotifycdn.com/images/guidelines/design/icon3.svg"
            alt="Spotify logo"
          />
          <LoginButton />
        </div>
      ) : (
        <div >
          <header >
            <div>
              <h2>Conectado</h2>

            </div>
            {!load && (
              <PlaylistForm onSubmit={(id: string) => submit(id)} />
            )}
          </header>
          <main>
            {auth.accessToken && value && load && (
              <Game id={value} accessToken={auth.accessToken} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}
