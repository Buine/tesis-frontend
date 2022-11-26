import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import queryService from "../../../services/queries";
import styles from "../../../styles/Queries.module.css"

export default function Queries() {
    const router = useRouter()
    const [queries, setQueries] = useState([])
    const { integration, name, database } = router.query

    useEffect(() => {
        if (integration) {
            queryService.getAllQueries(integration).then(response => {
                if (!response.err) {
                    setQueries(response.res)
                }
              })
        }
    },[integration])

    return (
        <div>
            <Head>
                <title>List queries from a integration</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.header_container}>
                    <div>
                        <h3>Queries of integration &quot;{name}&quot;</h3>
                        <p>Name database: {database}</p>
                    </div>
                    <div>
                    <Link href={`/query-builder-v2?integration=${integration}&tab=0`}>
                        <div className={styles.button}>
                            Create a new query
                        </div>
                        </Link>
                    </div>
                </div> 
                <div className={styles.window}>
                    <div className={styles.window_toolbar}>
                        <div className={styles.window_circle} style={{backgroundColor: '#FF5151'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#FFD43D'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#86CF4C'}} />
                    </div>
                    <div className={styles.window_container}>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                </tr>
                                { queries.length == 0 &&
                                    <tr className={styles.row_query}>
                                        <td>😨 You still do not have created queries</td>
                                        <td>Try to create with the button &quot;Create a new query&quot;</td>
                                    </tr>
                                }
                                {queries.map(query => {
                                    let statusColor = "SUCCESSFULLY" == 'SUCCESSFULLY' ? '#86CF4C' : '#FF5454'
                                    return (
                                        <Link href={`/query-builder-v2?integration=${integration}&query=${query.code}&tab=0`} key={query.code}>
                                            <tr className={styles.row_query} key={query.code}>
                                                <td>{query.name}</td>
                                                <td><div><div className={styles.circle} style={{backgroundColor: statusColor}} />SUCCESSFULLY</div></td>
                                            </tr>
                                        </Link>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}