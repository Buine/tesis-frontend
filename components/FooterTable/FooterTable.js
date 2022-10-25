import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import styles from "./FooterTable.module.css"

export default function FooterTable() {
    const { queryResult } = useQueryBuilderContext()

    return <div className={styles.container}>
        {queryResult.time ? `⏳ Executed in ${queryResult.time.toFixed(1)} ms.` : `🚀 Ready for execute query...`}
    </div>
}