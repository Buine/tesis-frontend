import QueryBuilder from "../components/QueryBuilder/QueryBuilder"
import QueryBuilderTabs, { TabPanel } from "../components/QueryBuilderTabs/QueryBuilderTabs"
import styles from "../styles/QueryBuilderV2.module.css"

export default function QueryBuilderV2() {
    return (
        <main className={styles.main}>
            <QueryBuilderTabs tabs={["Query", "Chart"]}>
                <TabPanel>
                    <QueryBuilder />
                </TabPanel>
                <TabPanel>
                    <div>
                    Aqui estara la seccion para realizar reportes/graficas.
                    </div>
                </TabPanel>
            </QueryBuilderTabs>
        </main>
    )
}