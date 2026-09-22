import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, getErrorMessage } from '../api/client.js'

export default function Booking({ user }) {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`)
        setEvent(res.data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [eventId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/bookings', {
        userId: user.id,
        eventId: Number(eventId),
        seats: Number(seats),
      })
      setSuccess(true)
      setTimeout(() => navigate('/my-bookings'), 1200)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="muted">Loading event…</p>
  if (error && !event) return <div className="form-error">{error}</div>
  if (!event) return null

  const seatsAvailable = event.capacity - event.seatsBooked
  const total = (event.price * seats).toFixed(2)

  return (
    <div className="booking-page">
      <Link to="/events" className="back-link">
        ← Back to events
      </Link>

      <div className="booking-card">
        <p className="ticket-game">{event.game}</p>
        <h2>{event.title}</h2>
        <p className="muted">{event.venue}</p>

        {success ? (
          <div className="form-success">Booking confirmed! Redirecting to your bookings…</div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            {error && <div className="form-error">{error}</div>}

            <label>
              Number of seats
              <input
                type="number"
                min={1}
                max={seatsAvailable}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
            </label>

            <div className="booking-summary">
              <div className="stub-row">
                <span className="stub-label">Seats available</span>
                <span className="stub-value">{seatsAvailable}</span>
              </div>
              <div className="stub-row">
                <span className="stub-label">Price per seat</span>
                <span className="stub-value">${event.price.toFixed(2)}</span>
              </div>
              <div className="stub-row stub-total">
                <span className="stub-label">Total</span>
                <span className="stub-value">${total}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={submitting || seatsAvailable <= 0}
            >
              {submitting ? 'Confirming…' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
