import { Link } from 'react-router-dom'
import type { Event } from '../types'

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  const time = new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const placesLeft = event.nombreDePlaces != null ? event.nombreDePlaces - event.nombreInscrits : null
  const full = placesLeft !== null && placesLeft <= 0

  return (
    <Link to={`/events/${event.id}`} className="card card-link fade-in" style={styles.card}>
      {/* Bande couleur en haut */}
      <div style={styles.colorBar} />

      <div style={styles.body}>
        <div style={styles.topRow}>
          <span style={styles.lieu}>📍 {event.lieu}</span>
          {full
            ? <span className="badge badge-red">Complet</span>
            : placesLeft !== null && placesLeft <= 5
              ? <span className="badge badge-blue">{placesLeft} places</span>
              : null
          }
        </div>

        <h3 style={styles.titre}>{event.titre}</h3>
        <p style={styles.desc}>{event.description.slice(0, 100)}{event.description.length > 100 ? '…' : ''}</p>

        <div className="divider" style={{ margin: '12px 0' }} />

        <div style={styles.footer}>
          <span style={styles.meta}>📅 {date} · {time}</span>
          <span style={styles.meta}>
            👥 {event.nombreInscrits}{event.nombreDePlaces ? `/${event.nombreDePlaces}` : ''} participant{event.nombreInscrits > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  colorBar: { height: 4, background: 'linear-gradient(90deg, #2563eb, #60a5fa)', flexShrink: 0 },
  body: { padding: '16px 20px 20px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  lieu: { fontSize: 12, color: '#6b7280', fontWeight: 500 },
  titre: { fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6, lineHeight: 1.4 },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5 },
  footer: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 },
  meta: { fontSize: 12, color: '#9ca3af' },
}
