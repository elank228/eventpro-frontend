import type { ReactNode } from 'react'

const LEFT_ANIMALS  = ['🐒','🦧','🍌','🌿','🦜','🐒','🍃','🦍','🌴','🐒','🍌','🦧']
const RIGHT_ANIMALS = ['🦍','🐒','🌿','🍌','🦧','🌴','🐒','🦜','🍃','🦍','🐒','🍌']

const ANIM_CLASSES = ['swing','bounce','wiggle','float','swing delay-2','bounce delay-3','wiggle delay-1','float delay-4','swing delay-5','bounce delay-2','wiggle delay-3','float delay-1']

export default function JungleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Barre jungle haut */}
      <div className="jungle-top" />

      {/* Singes côté gauche */}
      <div className="monkey-left">
        {LEFT_ANIMALS.map((a, i) => (
          <span key={i} className={ANIM_CLASSES[i % ANIM_CLASSES.length]} style={{ fontSize: i % 3 === 0 ? 32 : 24 }}>
            {a}
          </span>
        ))}
      </div>

      {/* Singes côté droit */}
      <div className="monkey-right">
        {RIGHT_ANIMALS.map((a, i) => (
          <span key={i} className={ANIM_CLASSES[(i + 3) % ANIM_CLASSES.length]} style={{ fontSize: i % 3 === 1 ? 32 : 24 }}>
            {a}
          </span>
        ))}
      </div>

      {/* Contenu */}
      {children}

      {/* Barre jungle bas */}
      <div className="jungle-bottom" />
    </>
  )
}
