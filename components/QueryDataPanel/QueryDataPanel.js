import QueryImport from "../QueryImport/QueryImport"
import styles from "./QueryDataPanel.module.css"

export default function QueryDataPanel() {
    return <div className={styles.container}>
        <div className={styles.header_data}>
            <p>Data in use</p>
            <div className={styles.add_data_button}></div>
        </div>
        <div className={styles.list_data}>
            <div className={styles.list_data_child}>
                <QueryImport type="MAIN"/>
                <QueryImport type="TABLE"/>
                <QueryImport type="QUERY"/>
            </div>
        </div>
    </div>
}