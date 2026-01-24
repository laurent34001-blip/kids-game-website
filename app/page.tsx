import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>🎮 Kids Game Website 🎨</h1>
        <p className={styles.subtitle}>Welcome to the most fun place on the internet!</p>
        
        <div className={styles.gameGrid}>
          <Link href="/memory-game" className={styles.gameCard}>
            <div className={styles.gameIcon}>🧠</div>
            <h2>Memory Game</h2>
            <p>Test your memory skills!</p>
          </Link>
          
          <div className={`${styles.gameCard} ${styles.comingSoon}`}>
            <div className={styles.gameIcon}>🎯</div>
            <h2>Coming Soon</h2>
            <p>More games on the way!</p>
          </div>
          
          <div className={`${styles.gameCard} ${styles.comingSoon}`}>
            <div className={styles.gameIcon}>🎲</div>
            <h2>Coming Soon</h2>
            <p>More games on the way!</p>
          </div>
          
          <div className={`${styles.gameCard} ${styles.comingSoon}`}>
            <div className={styles.gameIcon}>🎪</div>
            <h2>Coming Soon</h2>
            <p>More games on the way!</p>
          </div>
        </div>
        
        <div className={styles.footer}>
          <p>✨ Have fun playing! ✨</p>
        </div>
      </div>
    </main>
  )
}
