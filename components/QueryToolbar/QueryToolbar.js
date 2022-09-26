import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import queryService from "../../services/queries"
import DropdownMenu from "../DropdownMenu/DropdownMenu"
import FilterMenu from "../FilterMenu/FilterMenu"
import HideFieldsComponent from "../HideFieldsComponent/HideFieldsComponent"
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
        // From
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
  
          // Select
          let columns = []
          let selectColumns = valuesUi.columns
          selectColumns.forEach(column => {
            if (column.alias != "" && column.status) {
              let [idxSchema, idxTable, idxColumn] = column.value.split(".")
              columns.push({
                type: "COLUMN",
                table_column: {
                  schema_name: schemas[idxSchema].name,
                  table_name: schemas[idxSchema].tables[idxTable].name,
                  column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name} AS ${column.name}`, //TODO: Delete AS when in ms accept column_alias
                  alias: column.alias,
                  column_alias: column.name
                }
              })
            }
          })
          query.query_json.columns = columns

          // Filters
          // id: uuidv4(),
          //   gate: "AND",
          //   left_column: "",
          //   condition: "",
          //   sub_condition: "",
          //   input_value: "",
          //   input_column: ""
          let filters = []
          let currentFilters = valuesUi.filters
          currentFilters.forEach(filter => {
            let typeCondition = filter.condition.split("_")
            typeCondition = typeCondition.length > 0 ? typeCondition[typeCondition.length-1] : ""
            let condition = typeCondition 
              ? filter.condition.replace(`_${typeCondition}`, "") 
              : filter.condition

            if (typeCondition == "SELECT") {
              typeCondition = filter.sub_condition.split("_")
              typeCondition = typeCondition.length > 0 ? typeCondition[typeCondition.length-1] : ""
              let sub_condition = typeCondition 
                ? filter.sub_condition.replace(`_${typeCondition}`, "") 
                : filter.sub_condition
            }

            let params = []
            
            // Left column
            let dataType = ""
            if (filter.left_column != "") {
              let [idxSchema, idxTable, idxColumn] = filter.left_column.split(".")
              let column = valuesUi.columns.filter(column => column.value == filter.left_column)
              console.log(column)
              column = column.length > 0 ? column[0] : {}
              dataType = column.data_type
              params.push({
                type: "COLUMN",
                table_column: {
                  schema_name: schemas[idxSchema].name,
                  table_name: schemas[idxSchema].tables[idxTable].name,
                  column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`, //TODO: Delete AS when in ms accept column_alias
                  alias: column.alias,
                  column_alias: column.name
                }
              })
            }

            if (["NULL", "NOT_NULL"].includes(filter.condition)) {
              typeCondition = "INPUT"
              filter.input_value = null
              condition = filter.condition == "NULL" ? "IS" : "IS_NOT"
              dataType = "NONE"
           }

           if (["TRUE", "FALSE"].includes(filter.condition)) {
              typeCondition = "INPUT"
              filter.input_value = filter.condition == "TRUE"
              console.log(filter.input_value)
              condition = "EQ"
              dataType = "NONE"
           }

            // Right column
            if (filter.input_column !== "" && typeCondition == "COLUMN") {
              let [idxSchema, idxTable, idxColumn] = filter.input_column.split(".")
              let column = valuesUi.columns.filter(column => column.value == filter.input_column)
              column = column.length > 0 ? column[0] : {}
              params.push({
                type: "COLUMN",
                table_column: {
                  schema_name: schemas[idxSchema].name,
                  table_name: schemas[idxSchema].tables[idxTable].name,
                  column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`, //TODO: Delete AS when in ms accept column_alias
                  alias: column.alias,
                  column_alias: column.name
                }
              })
            }

            // Parameter
            if (filter.input_value !== "" && typeCondition == "INPUT" || typeCondition == "DATEPICKER") {
              params.push({
                type: "PARAM",
                param: {
                  type_input: dataType,
                  value: condition.includes("ILIKE") ? `%${filter.input_value}%` : filter.input_value
                }
              })
            } 
            // Logic implementation here...


            if (condition != "") {
              filters.push({
                type: condition,
                params,
                gate_logic_previous: filter.gate
              })
            }
          })
          query.query_json.filters = filters
          

          console.log(copy)
          console.log(valuesUi)
          setQueryBuilderData(copy)
          executeQuery(copy, setQueryResult)
        }
    }

    return <div className={styles.container}>
        <div className={styles.tools}>
          <DropdownMenu actionComponent={<div className={styles.tool}>Hide fields</div>}>
            <HideFieldsComponent/>
          </DropdownMenu>
          <DropdownMenu actionComponent={<div className={styles.tool}>Filter</div>}>
            <FilterMenu />
          </DropdownMenu>
          <DropdownMenu actionComponent={<div className={styles.tool}>Group</div>}>
            <div>
              Aqui el body  
            </div>  52138816
          </DropdownMenu>
          <DropdownMenu actionComponent={<div className={styles.tool}>Sort</div>}>
            <div>
              Aqui el body  
            </div>  
          </DropdownMenu>
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