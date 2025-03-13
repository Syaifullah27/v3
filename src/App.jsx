/* eslint-disable no-unused-vars */
import { useState } from 'react'
import axios from 'axios'
import { FiDownload, FiMusic } from 'react-icons/fi'
import Loader from './components/Loader'
import './App.css'
import Navbar from './components/Navbar/Navbar'

export default function App() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename || 'tiktok-video'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      setError('Failed to download file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return
    
    setLoading(true)
    setError('')
    
    try {
      const options = {
        method: 'GET',
        url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
        params: { url, hd: '1' },
        headers: {
          'x-rapidapi-key': 'e3c9aaf249msh9d7514dbcb20064p15b928jsn5590edf36d1e',
          'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      if (response.data.code === 0) {
        setData(response.data.data)
      } else {
        setError('Failed to fetch video information')
      }
    } catch (err) {
      setError('Invalid URL or API error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
<>
    <Navbar />

    <div className="container">
      <h1 className="title">
        TikTok Video Downloader
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="input"
            placeholder="Paste TikTok URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button>Send</button>
        </div>
      </form>

      {loading && <Loader />}

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="result">
          <div className="user-info">
            <img
              src={data.author.avatar}
              alt="User Avatar"
              className="avatar"
            />
            <h3>{data.author.nickname}</h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>{data.title}</p>
          </div>

          <div className="video-container">
            <video
              className="video-player"
              src={data.hdplay || data.play}
              controls
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          <div className="download-buttons">
            <button
              className="btn btn-primary"
              onClick={() => handleDownload(data.hdplay || data.play, `tiktok-${data.aweme_id}.mp4`)}
            >
              <FiDownload /> Download Video
            </button>
            
            <button
              className="btn btn-primary"
              onClick={() => handleDownload(data.music, `tiktok-sound-${data.aweme_id}.mp3`)}
            >
              <FiMusic /> Download Sound
            </button>
          </div>
        </div>
      )}
    </div>
</>

  )
}