import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="hero">
      <p className="hero-eyebrow">LIVE / LOCAL / LAN</p>
      <h1 className="hero-title">
        Your seat at the
        <br />
        next gaming event.
      </h1>
      <p className="hero-subtitle">
        Browse local tournaments, community cups, and LAN nights. Reserve your
        seat in seconds, no line required.
      </p>
      <div className="hero-actions">
        <Link to="/events" className="btn btn-primary btn-lg">
          Browse Events
        </Link>
        <Link to="/register" className="btn btn-ghost btn-lg">
          Create Account
        </Link>
      </div>
    </div>
  )
}
