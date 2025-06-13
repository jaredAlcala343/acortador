"use client"
import { useState } from 'react'
import { supabase } from '../../supabaseClient' // <-- Fix the import path
import './page.css'
export default function UrlShortener() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          customCode: customCode || undefined
        })
      })
      
      const data = await response.json()
      if (response.ok) {
        setShortUrl(data.shortUrl)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Error al acortar la URL')
    }
  }

  return (
    <div>
      <h1>Acortador de URLs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ingresa tu URL larga"
          required
        />
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="Código personalizado (opcional)"
        />
        <button type="submit">Acortar</button>
      </form>
      
      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div>
          <p>Tu URL corta:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  )
}