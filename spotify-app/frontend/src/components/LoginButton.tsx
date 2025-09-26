import React from 'react'

export default function LoginButton(){
  const handleLogin = () => {
    window.location.href = `http://localhost:4000/auth/login`
  }
  return (
    <button onClick={handleLogin} className="px-4 py-2 rounded bg-indigo-600 text-white">Conectar con Spotify</button>
  )
}
