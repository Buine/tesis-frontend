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
                        <Link href={`/query-builder?integration=${integration}`}>
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
                                    <th>Updated at</th>
                                </tr>
                                {queries.forEach(query => {
                                    let statusColor = query.status == 'SUCCESSFULLY' ? '#86CF4C' : '#FF5454'
                                    return (
                                        <tr className={styles.row_query} key={query.code}>
                                            <td>{query.name}</td>
                                            <td><div><div className={styles.circle} style={{backgroundColor: statusColor}} />{query.status}</div></td>
                                            <td>{query.updated_at}</td>
                                        </tr>
                                    )
                                })}
                                <tr className={styles.row_query}>
                                    <td>List clients by revenue every month of year 2021</td>
                                    <td><div><div className={styles.circle} style={{backgroundColor: '#86CF4C'}} />SUCCESSFULLY</div></td>
                                    <td>Friday 19 Aug 5:26PM</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}