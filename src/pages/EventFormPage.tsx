import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, getEvent, updateEvent } from '../api/events'

export default function EventFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState({ titre: '', description: '', date: '', lieu: '', nombreDePlaces: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getEvent(Number(id)).then(({ data }) =>
      setForm({ titre: data.titre, description: data.description, date: data.date.slice(0, 16), lieu: data.lieu, nombreDePlaces: data.nombreDePlaces?.toString() ?? '' })
    )
  }, [id, isEdit])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const payload = { titre: form.titre, description: form.description, date: new Date(form.date).toISOString(), lieu: form.lieu, nombreDePlaces: form.nombreDePlaces ? Number(form.nombreDePlaces) : null }
    try {
      if (isEdit) { await updateEvent(Number(id), payload); navigate(`/events/${id}`) }
      else { const { data } = await createEvent(payload as any); navigate(`/events/${data.id}`) }
    } catch (err: any) { setError(err.response?.data?.error ?? 'Erreur lors de la sauvegarde.') }
    finally { setLoading(false) }
  }

  return (
    <div style={styles.page}>
      <div className="card fade-in" style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.title}>{isEdit ? 'Modifier l\'événement' : 'Créer un événement'}</h1>
          <p style={styles.subtitle}>{isEdit ? 'Mettez à jour les informations de l\'événement' : 'Remplissez les informations de votre nouvel événement'}</p>
        </div>

        <div className="divider" />

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label className="label">Titre de l'événement *</label>
            <input className="input" placeholder="Ex : Conférence annuelle 2025"
              value={form.titre} onChange={set('titre')} required />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label className="label">Date et heure *</label>
              <input className="input" type="datetime-local" value={form.date} onChange={set('date')} required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Lieu *</label>
              <input className="input" placeholder="Ex : Paris, Salle Pleyel"
                value={form.lieu} onChange={set('lieu')} required />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input" placeholder="Décrivez votre événement…"
              value={form.description} onChange={set('description')} />
          </div>

          <div style={{ maxWidth: 200 }}>
            <label className="label">Nombre de places (optionnel)</label>
            <input className="input" type="number" placeholder="Illimité si vide"
              value={form.nombreDePlaces} onChange={set('nombreDePlaces')} min={1} />
          </div>

          <div className="divider" />

          <div style={styles.actions}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sauvegarde…' : isEdit ? 'Mettre à jour' : 'Créer l\'événement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '40px 24px', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 680, padding: 32, alignSelf: 'flex-start' },
  cardHeader: { marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
}
