import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import QueryImport from "../QueryImport/QueryImport"
import styles from "./QueryDataPanel.module.css"

export default function QueryDataPanel() {
    const { valuesUi, setValuesUi, queryBuilderData } = useQueryBuilderContext()

    const createImport = () => {
        let copy = {...valuesUi}
        copy.tables.push({
            type: "TABLE",
            value: null,
            alias: ""
        })

        setValuesUi(copy)
    }

    return <div className={styles.container}>
        <div className={styles.header_data}>
            <p>Data in use</p>
            <div className={styles.add_data_button} onClick={createImport}></div>
        </div>
        <div className={styles.list_data}>
            <div className={styles.list_data_child}>
                {
                    valuesUi.tables.map((tableImport, idx) => {
                        return <QueryImport key={idx} idxImport={idx} type={tableImport.type}/>    
                     })
                    }
            </div>
        </div>
    </div>
}