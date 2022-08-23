import styles from './Logo.module.css'

export default function Logo({scale = 1}) {
    return(
        <div className={styles.container} style={{
            transform: `scale(${scale})`
        }}>
            <div className={styles.card}>
            </div>
            <div className={`${styles.card} ${styles.float}`}>
            </div>
            <p className={styles.text}>Query<strong>Builder</strong></p>
        </div>
    )
}