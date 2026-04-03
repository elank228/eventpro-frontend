import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../api/events'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data.token, data.user); navigate('/events')
    } catch { setError('Email ou mot de passe incorrect.') }
    finally { setLoading(false) }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card fade-in">
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>E</div>
          <span style={styles.logoText}>EventPro</span>
        </div>

        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.subtitle}>Accédez à votre espace de gestion d'événements</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label className="label">Adresse email</label>
            <input className="input" type="email" placeholder="vous@entreprise.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="divider" />
        <p style={styles.link}>
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
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
