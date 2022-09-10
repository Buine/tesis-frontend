import dynamic from "next/dynamic";
import { useMemo } from "react";
import FooterTable from "../FooterTable/FooterTable";
import QueryDataPanel from "../QueryDataPanel/QueryDataPanel"
import QueryToolbar from "../QueryToolbar/QueryToolbar"
import styles from "./QueryBuilder.module.css"

export default function QueryBuilder() {

    const HotTableNoSSR = useMemo(() => dynamic(
        () => import("../HotTable/HotTable"),
        {
            // TODO: Modify this with a class in module.css
            loading: () => {
                console.log("loading")
                return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}><p>loading...</p></div>
            },
            ssr: false
        }
      ), []);

    return <div className={styles.container}>
        <QueryDataPanel />
        <div className={styles.right_division}>
            <QueryToolbar />
            <div className={styles.table_div}>
                <HotTableNoSSR />
            </div>
            <FooterTable />
        </div>
    </div>
}