import React from 'react'
import Button from '@mui/material/Button';

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`
  }

  return (
    <Button onClick={handleLogin} variant="contained" color='success' style={{ backgroundColor: '#1ed760', color: 'black', borderRadius: '20px' }}>Conectar con Spotify</Button>
  )
}
