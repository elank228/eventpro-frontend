import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/events" style={styles.logo}>
          <div style={styles.logoIcon}>E</div>
          <span style={styles.logoText}>EventPro</span>
        </Link>

        {/* Nav */}
        <nav style={styles.nav}>
          <Link to="/events" style={styles.navLink}>Événements</Link>
        </nav>

        {/* Auth */}
        <div style={styles.auth}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <span className="badge badge-blue">Admin</span>
              )}
              <Link to="/events/new" className="btn btn-primary btn-sm">
                + Créer un événement
              </Link>
              <div style={styles.userMenu}>
                <div style={styles.avatar}>{user.nom[0].toUpperCase()}</div>
                <span style={styles.userName}>{user.nom}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/login') }}>
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Créer un compte</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  logo: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 },
  logoIcon: { width: 32, height: 32, background: '#2563eb', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
  logoText: { fontWeight: 700, fontSize: 17, color: '#111827' },
  nav: { display: 'flex', gap: 4, flex: 1, paddingLeft: 24 },
  navLink: { color: '#4b5563', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6, textDecoration: 'none', transition: 'background 0.15s' },
  auth: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  userMenu: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: { width: 30, height: 30, background: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, border: '1px solid #bfdbfe' },
  userName: { fontSize: 14, fontWeight: 500, color: '#374151' },
}
