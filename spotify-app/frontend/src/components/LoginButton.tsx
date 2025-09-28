import React from 'react'
import Button from '@mui/material/Button';

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = `http://localhost:4000/auth/login`
  }

  return (
    <Button onClick={handleLogin} variant="contained" color='success' style={{ backgroundColor: '#1ed760', color: 'black', borderRadius: '20px' }}>Conectar con Spotify</Button>

    /* <button
       onClick={handleLogin}
       className="px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold transition"
     >
       Conectar con Spotify
     </button>*/
  )
}
