import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent, getParticipants, registerToEvent, unregisterFromEvent, deleteEvent } from '../api/events'
import { useAuth } from '../context/AuthContext'
import type { Event } from '../types'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [participants, setParticipants] = useState<{ id: number; nom: string; email: string }[]>([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const eventId = Number(id)

  useEffect(() => {
    Promise.all([getEvent(eventId), getParticipants(eventId)])
      .then(([evRes, partRes]) => {
        setEvent(evRes.data)
        setParticipants(partRes.data)
        setIsRegistered(partRes.data.some(p => p.id === user?.id))
      })
      .catch(() => setError('Événement introuvable.'))
      .finally(() => setLoading(false))
  }, [eventId, user])

  const handleRegistration = async () => {
    setActionLoading(true); setError('')
    try {
      if (isRegistered) {
        await unregisterFromEvent(eventId)
        setParticipants(p => p.filter(u => u.id !== user!.id))
        setIsRegistered(false)
        setEvent(e => e ? { ...e, nombreInscrits: e.nombreInscrits - 1 } : e)
      } else {
        await registerToEvent(eventId)
        setParticipants(p => [...p, { id: user!.id, nom: user!.nom, email: user!.email }])
        setIsRegistered(true)
        setEvent(e => e ? { ...e, nombreInscrits: e.nombreInscrits + 1 } : e)
      }
    } catch (err: any) { setError(err.response?.data?.error ?? 'Une erreur est survenue.') }
    finally { setActionLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer cet événement ?')) return
    await deleteEvent(eventId)
    navigate('/events')
  }

  if (loading) return <div style={styles.center}><p style={{ color: '#9ca3af' }}>Chargement…</p></div>
  if (!event) return <div style={styles.center}><p style={{ color: '#dc2626' }}>{error || 'Événement introuvable.'}</p></div>

  const date = new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  const time = new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const isOwner = user?.id === event.createur.id
  const placesLeft = event.nombreDePlaces != null ? event.nombreDePlaces - event.nombreInscrits : null
  const isFull = placesLeft !== null && placesLeft <= 0 && !isRegistered

  return (
    <div className="page-wrapper fade-in" style={{ maxWidth: 900 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')} style={{ marginBottom: 20 }}>
        ← Retour aux événements
      </button>

      <div style={styles.grid}>
        {/* Colonne principale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header */}
          <div className="card" style={styles.headerCard}>
            <div style={styles.colorBar} />
            <div style={{ padding: '20px 24px' }}>
              <div style={styles.topRow}>
                <span style={styles.lieu}>📍 {event.lieu}</span>
                {(isOwner || isAdmin) && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/events/${eventId}/edit`)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>Supprimer</button>
                  </div>
                )}
              </div>
              <h1 style={styles.titre}>{event.titre}</h1>
              <p style={styles.orga}>Organisé par <strong>{event.createur.nom}</strong></p>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <div className="divider" />
            <p style={styles.desc}>{event.description || 'Aucune description fournie.'}</p>
          </div>

          {/* Participants */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <h2 style={styles.sectionTitle}>Participants ({participants.length})</h2>
            <div className="divider" />
            {participants.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Aucun participant pour l'instant.</p>
            ) : (
              <div style={styles.partGrid}>
                {participants.map(p => (
                  <div key={p.id} style={styles.partItem}>
                    <div style={styles.partAvatar}>{p.nom[0].toUpperCase()}</div>
                    <div>
                      <div style={styles.partName}>
                        {p.nom}
                        {p.id === user?.id && <span className="badge badge-blue" style={{ marginLeft: 6 }}>Vous</span>}
                      </div>
                      <div style={styles.partEmail}>{p.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Infos */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <h2 style={styles.sectionTitle}>Informations</h2>
            <div className="divider" />
            <div style={styles.infoList}>
              {[
                { label: 'Date', value: date },
                { label: 'Heure', value: time },
                { label: 'Lieu', value: event.lieu },
                { label: 'Participants', value: `${event.nombreInscrits}${event.nombreDePlaces ? ` / ${event.nombreDePlaces}` : ''}` },
              ].map(({ label, value }) => (
                <div key={label} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{label}</span>
                  <span style={styles.infoValue}>{value}</span>
                </div>
              ))}
              {placesLeft !== null && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Places restantes</span>
                  <span>
                    {placesLeft <= 0
                      ? <span className="badge badge-red">Complet</span>
                      : <span className="badge badge-green">{placesLeft} disponible{placesLeft > 1 ? 's' : ''}</span>
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action inscription */}
          {user && (
            <div className="card" style={{ padding: '20px 24px' }}>
              {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
              {isRegistered ? (
                <>
                  <div className="alert alert-success" style={{ marginBottom: 12 }}>
                    ✓ Vous êtes inscrit à cet événement
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%' }}
                    onClick={handleRegistration} disabled={actionLoading}>
                    {actionLoading ? 'Traitement…' : 'Se désinscrire'}
                  </button>
                </>
              ) : isFull ? (
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                  Événement complet
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }}
                  onClick={handleRegistration} disabled={actionLoading}>
                  {actionLoading ? 'Traitement…' : 'S\'inscrire à l\'événement'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center: { textAlign: 'center', padding: '80px 0' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' },
  headerCard: { overflow: 'hidden' },
  colorBar: { height: 4, background: 'linear-gradient(90deg, #2563eb, #60a5fa)' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  lieu: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  titre: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6, lineHeight: 1.3 },
  orga: { fontSize: 14, color: '#6b7280' },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: '#374151' },
  desc: { fontSize: 14, color: '#4b5563', lineHeight: 1.7 },
  infoList: { display: 'flex', flexDirection: 'column', gap: 12 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 },
  infoLabel: { color: '#6b7280' },
  infoValue: { color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' },
  partGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  partItem: { display: 'flex', alignItems: 'center', gap: 10 },
  partAvatar: { width: 34, height: 34, background: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, border: '1px solid #bfdbfe', flexShrink: 0 },
  partName: { fontSize: 14, fontWeight: 500, color: '#111827', display: 'flex', alignItems: 'center' },
  partEmail: { fontSize: 12, color: '#9ca3af' },
}
