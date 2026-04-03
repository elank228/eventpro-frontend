import { useState, useEffect } from 'react'
import { getEvents } from '../api/events'
import type { Event, EventQueryParams } from '../types'
import EventCard from '../components/EventCard'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<EventQueryParams>({ page: 1, pageSize: 9 })
  const [lieu, setLieu] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  const totalPages = Math.ceil(total / (filters.pageSize ?? 9))

  useEffect(() => {
    setLoading(true)
    getEvents(filters)
      .then(({ data }) => { setEvents(data.items); setTotal(data.total) })
      .finally(() => setLoading(false))
  }, [filters])

  const applyFilters = () =>
    setFilters({ page: 1, pageSize: 9, lieu: lieu || undefined, dateDebut: dateDebut || undefined, dateFin: dateFin || undefined })

  const resetFilters = () => {
    setLieu(''); setDateDebut(''); setDateFin('')
    setFilters({ page: 1, pageSize: 9 })
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Événements</h1>
          <p className="page-subtitle">{total} événement{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card" style={styles.filtersCard}>
        <div style={styles.filtersRow}>
          <input className="input" style={{ maxWidth: 200 }} placeholder="Lieu" value={lieu}
            onChange={e => setLieu(e.target.value)} />
          <div style={styles.dateGroup}>
            <label className="label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Du</label>
            <input className="input" type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
          </div>
          <div style={styles.dateGroup}>
            <label className="label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Au</label>
            <input className="input" type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={applyFilters}>Rechercher</button>
          <button className="btn btn-secondary" onClick={resetFilters}>Réinitialiser</button>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div style={styles.center}>
          <p style={{ color: '#9ca3af' }}>Chargement…</p>
        </div>
      ) : events.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📅</div>
          <p style={styles.emptyTitle}>Aucun événement trouvé</p>
          <p style={styles.emptySubtitle}>Essayez de modifier vos filtres ou créez le premier événement.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button className="btn btn-secondary btn-sm" disabled={filters.page === 1}
            onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) - 1 }))}>
            ← Précédent
          </button>
          <span style={styles.pageInfo}>Page {filters.page} sur {totalPages}</span>
          <button className="btn btn-secondary btn-sm" disabled={filters.page === totalPages}
            onClick={() => setFilters(f => ({ ...f, page: (f.page ?? 1) + 1 }))}>
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  filtersCard: { padding: '16px 20px', marginBottom: 24 },
  filtersRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  dateGroup: { display: 'flex', alignItems: 'center', gap: 8 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  center: { textAlign: 'center', padding: '60px 0' },
  empty: { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: 600, color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', maxWidth: 360 },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 40 },
  pageInfo: { fontSize: 14, color: '#6b7280' },
}
