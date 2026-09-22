import { useEffect, useState } from 'react'
import { api, getErrorMessage } from '../api/client.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const loadBookings = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/bookings/user/${user.id}`)
      setBookings(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [user.id])

  const handleCancel = async (id) => {
    setCancellingId(id)
    try {
      await api.delete(`/bookings/${id}`)
      await loadBookings()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {error && <div className="form-error">{error}</div>}
      {loading && <p className="muted">Loading your bookings…</p>}
      {!loading && bookings.length === 0 && (
        <p className="muted">You haven't booked any events yet.</p>
      )}

      <div className="bookings-list">
        {bookings.map((b) => (
          <div key={b.id} className={`booking-row ${b.status === 'CANCELLED' ? 'cancelled' : ''}`}>
            <div>
              <p className="ticket-game">{b.event.game}</p>
              <h3>{b.event.title}</h3>
              <p className="muted">
                {formatDate(b.event.eventDate)} · {b.event.venue}
              </p>
            </div>
            <div className="booking-row-meta">
              <span className="stub-value">{b.seatsBooked} seat(s)</span>
              <span className="stub-value">${b.totalPrice.toFixed(2)}</span>
              <span className={`status-tag ${b.status.toLowerCase()}`}>{b.status}</span>
              {b.status === 'CONFIRMED' && (
                <button
                  className="btn btn-ghost"
                  onClick={() => handleCancel(b.id)}
                  disabled={cancellingId === b.id}
                >
                  {cancellingId === b.id ? 'Cancelling…' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
