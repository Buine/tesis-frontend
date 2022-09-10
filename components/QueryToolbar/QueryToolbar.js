import styles from "./QueryToolbar.module.css"

export default function QueryToolbar() {
    return <div className={styles.container}>
        <div className={styles.tools}>
            <div className={styles.tool}>Hide fields</div>
            <div className={styles.tool}>Filter</div>
            <div className={styles.tool}>Group</div>
            <div className={styles.tool}>Sort</div>
        </div>
        <div className={styles.save_button}>
            Save Query
        </div>
    </div>
}