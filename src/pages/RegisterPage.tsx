import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/events'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await registerApi(form)
      login(data.token, data.user); navigate('/events')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erreur lors de la création du compte.')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card fade-in">
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>E</div>
          <span style={styles.logoText}>EventPro</span>
        </div>

        <h1 style={styles.title}>Créer un compte</h1>
        <p style={styles.subtitle}>Rejoignez la plateforme de gestion d'événements</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label className="label">Nom complet</label>
            <input className="input" placeholder="Jean Dupont"
              value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Adresse email</label>
            <input className="input" type="email" placeholder="vous@entreprise.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input" type="password" placeholder="Minimum 6 caractères"
              value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} minLength={6} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <div className="divider" />
        <p style={styles.link}>
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 16 },
  card: { width: '100%', maxWidth: 400, padding: 32 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 },
  logoIcon: { width: 36, height: 36, background: '#2563eb', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 },
  logoText: { fontWeight: 700, fontSize: 18, color: '#111827' },
  title: { fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  link: { textAlign: 'center', fontSize: 14, color: '#6b7280' },
}
