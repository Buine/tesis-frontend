import styles from "./Slider.module.css"

export default function Slider({status, setStatus}) {
    return <label className={styles.switch}>
        <input type="checkbox" checked={status} onChange={setStatus} />
        <span className={`${styles.slider} ${styles.round}`}></span>
  </label>
}