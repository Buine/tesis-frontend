import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import queryService from "../../services/queries"
import styles from "./QueryToolbar.module.css"

export default function QueryToolbar() {
    const { queryBuilderData, setQueryBuilderData, valuesUi, setQueryResult } = useQueryBuilderContext()

    const TableTypes = ["MAIN", "TABLE"]

    const generateQueryJson = () => {
        let metaTable = {}
  
        let copy = {...queryBuilderData}
        let query = copy.queryRequest
        let tables = query.query_json.tables
        let schemas = queryBuilderData.schema.schemas
        let importedTables = valuesUi.tables
        if (importedTables) {
          importedTables.forEach((table, idx) => {
            if (table.value == null) { return }
            let dataTable = idx == 0 ? tables : tables.table
            let [idxSchema, idxTable] = table.value.split(".")
            
            // 1. Fill data
            if (TableTypes.includes(table.type)) {
              dataTable.schema_name = schemas[idxSchema].name
              dataTable.table_name = schemas[idxSchema].tables[idxTable].name
              dataTable.alias = table.alias
              metaTable[`${table.value}.${table.id}`] = {alias: dataTable.alias}
            } else {
              // Query Input Table logic here...
            }
            
            // 2. Fill conditional if idx != 0
            if (idx != 0) {
              let [idxSchema, idxTable, idxColumn, idImport] = table.join[0].value.split(".")
              let leftColumn = `${metaTable[`${idxSchema}.${idxTable}.${idImport}`].alias}.${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`
              let [idxSchema2, idxTable2, idxColumn2, idImport2] = table.join[1].value.split(".")
              let rigthColumn = `${metaTable[`${idxSchema2}.${idxTable2}.${idImport2}`].alias}.${schemas[idxSchema2].tables[idxTable2].columns[idxColumn2].name}` 
              tables.join_conditional = {
                column_left: leftColumn,
                column_right: rigthColumn
              }
            }
  
            // 3. Change reference var tables to join
            if (tables.join == undefined && idx != importedTables.length-1) { tables.join = {type: "INNER", table:{}} }
            tables = tables.join
          })
  
          console.log(copy)
          setQueryBuilderData(copy)
          executeQuery(copy, setQueryResult)
        }
    }

    return <div className={styles.container}>
        <div className={styles.tools}>
            <div className={styles.tool}>Hide fields</div>
            <div className={styles.tool}>Filter</div>
            <div className={styles.tool}>Group</div>
            <div className={styles.tool}>Sort</div>
        </div>
        <div className={styles.save_button} onClick={generateQueryJson}>
            Save Query
        </div>
    </div>
}

function executeQuery(queryBuilderData, setQueryResult) {
    let start = performance.now()
    queryService.runQuery(queryBuilderData.queryRequest).then((response) => {
        if(!response.err) {
            setQueryResult({ response: response.res.data, time: performance.now()-start })
        } else {
            alert(JSON.stringify(response.err))
            console.error(response.err)
        }
    })
}