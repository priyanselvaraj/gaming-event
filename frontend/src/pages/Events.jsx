import { useEffect, useState } from 'react'
import { api, getErrorMessage } from '../api/client.js'
import EventCard from '../components/EventCard.jsx'

export default function Events() {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEvents = async (game = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/events', { params: game ? { game } : {} })
      setEvents(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadEvents(search)
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <form className="events-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Filter by game (e.g. Valorant)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-ghost" type="submit">
            Search
          </button>
        </form>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && <p className="muted">Loading events…</p>}
      {!loading && events.length === 0 && !error && (
        <p className="muted">No events found. Try a different game.</p>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
