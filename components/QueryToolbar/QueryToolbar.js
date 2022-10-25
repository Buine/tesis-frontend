import { createContext, useContext, useMemo, useState } from "react"
import { DropdownsProvider } from "../../contexts/DropdownsContext"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import queryService from "../../services/queries"
import DropdownMenu from "../DropdownMenu/DropdownMenu"
import FilterMenu from "../FilterMenu/FilterMenu"
import HideFieldsComponent from "../HideFieldsComponent/HideFieldsComponent"
import SortMenu from "../SortMenu/SortMenu"
import styles from "./QueryToolbar.module.css"

export default function QueryToolbar() {
    const { queryBuilderData, setQueryBuilderData, valuesUi, setQueryResult, queryResult } = useQueryBuilderContext()

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
              dataTable.query_code = idxSchema,
              dataTable.alias = table.alias
              metaTable[`${table.value}.${table.id}`] = {alias: dataTable.alias}
            }
            
            // 2. Fill conditional if idx != 0
            if (idx != 0) {
              let [idxSchema, idxTable, idxColumn, idImport] = table.join[0].value.split(".")
              let leftColumn = table.type != "QUERY" 
              ? `${metaTable[`${idxSchema}.${idxTable}.${idImport}`].alias}.${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`
              : valuesUi.columns.filter(c => { return c.value == table.join[0].value })[0].name
              let [idxSchema2, idxTable2, idxColumn2, idImport2] = table.join[1].value.split(".")
              let rigthColumn = table.type != "QUERY"
              ? `${metaTable[`${idxSchema2}.${idxTable2}.${idImport2}`].alias}.${schemas[idxSchema2].tables[idxTable2].columns[idxColumn2].name}` 
              : valuesUi.columns.filter(c => { return c.value == table.join[1].value })[0].name
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
                table_column: column.type != "QUERY" 
                ? {
                  schema_name: schemas[idxSchema].name,
                  table_name: schemas[idxSchema].tables[idxTable].name,
                  column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`,
                  alias: column.alias,
                  column_alias: column.name
                }
                : {
                  alias: column.alias,
                  column_name: `${column.only_name}`,
                  column_alias: column.name,
                  query_column: true
                }
              })
            }
          })
          query.query_json.columns = columns

          // Filters
          let filters = generateFilters(valuesUi.filters, schemas)
          query.query_json.filters = filters
          
          // Sort by
          let sorts = []
          valuesUi.sorts.forEach(sort => {
            if (sort.value != "") {
              let [idxSchema, idxTable, idxColumn] = sort.value.split(".")
              let column = valuesUi.columns.filter(column => column.value == sort.value)
              column = column.length > 0 ? column[0] : {}
              console.log("Holis", column)
              let info = column.type != "QUERY" 
              ? {
                schema_name: schemas[idxSchema].name,
                table_name: schemas[idxSchema].tables[idxTable].name,
                column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`,
                alias: column.alias,
                column_alias: column.name
              }
              : {
                alias: column.alias,
                column_name: `${column.only_name}`,
                column_alias: column.name,
                query_column: true
              }
              sorts.push(
                {
                  type: sort.direction,
                  ...info
                }
              )
            }
          })
          query.query_json.order = sorts

          console.log(copy)
          console.log(valuesUi)
          setQueryBuilderData(copy)
          executeQuery(copy, setQueryResult)
        }
    }

    function generateFilters(currentFilters) {
      // Filters
      // id: uuidv4(),
      //   gate: "AND",
      //   left_column: "",
      //   condition: "",
      //   sub_condition: "",
      //   input_value: "",
      //   input_column: ""
      let schemas = queryBuilderData.schema.schemas
      let filters = []
      currentFilters.forEach(filter => {
        if (filter.type != "GROUP") {
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
              table_column: column.type != "QUERY" 
              ? {
                schema_name: schemas[idxSchema].name,
                table_name: schemas[idxSchema].tables[idxTable].name,
                column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`,
                alias: column.alias,
                column_alias: column.name
              }
              : {
                alias: column.alias,
                column_name: `${column.only_name}`,
                column_alias: column.name,
                query_column: true
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
              table_column: column.type != "QUERY" 
              ? {
                schema_name: schemas[idxSchema].name,
                table_name: schemas[idxSchema].tables[idxTable].name,
                column_name: `${schemas[idxSchema].tables[idxTable].columns[idxColumn].name}`,
                alias: column.alias,
                column_alias: column.name
              }
              : {
                alias: column.alias,
                column_name: `${column.only_name}`,
                column_alias: column.name,
                query_column: true
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


          if (condition != "") {
            filters.push({
              type: condition,
              params,
              gate_logic_previous: filter.gate
            })
          }
        } else {
          let groupFilters = generateFilters(filter.filters)
          filters.push({
            type: "GROUP",
            group_conditions: groupFilters,
            gate_logic_previous: filter.gate
          })
        }
      })

      return filters
    }

    return <div className={styles.container}>
        <div className={styles.tools}>
          <DropdownsProvider>
            <DropdownMenu idx={0} actionComponent={<div className={styles.tool}>Hide fields</div>}>
              <HideFieldsComponent/>
            </DropdownMenu>
            <DropdownMenu idx={1} actionComponent={<div className={styles.tool}>Filter</div>}>
              <FilterMenu />
            </DropdownMenu>
            <DropdownMenu idx={2} actionComponent={<div className={styles.tool}>Group</div>}>
              <div>
                Aqui el body  
              </div>
            </DropdownMenu>
            <DropdownMenu idx={3} actionComponent={<div className={styles.tool}>Sort</div>}>
              <SortMenu />
            </DropdownMenu>
          </DropdownsProvider>
        </div>
        <div className={styles.tools}>
          <div className={styles.save_button} onClick={generateQueryJson}>
              Run Query
          </div>
          <div className={styles.save_button} onClick={() => saveQuery(queryBuilderData, setQueryBuilderData, queryResult)}>
              Save Query
          </div>
        </div>
    </div>
}

function executeQuery(queryBuilderData, setQueryResult) {
    let start = performance.now()
    queryService.runQuery(queryBuilderData.queryRequest).then((response) => {
        if(!response.err) {
            setQueryResult({ response: response.res.data, time: performance.now()-start, schema: response.res.schema, sql: response.res.sql })
        } else {
            alert(JSON.stringify(response.err))
            console.error(response.err)
        }
    })
}

function saveQuery(queryBuilderData, setQueryBuilderData, queryResult) {
  if (!queryBuilderData.isNewQuery) {
    // Update query
    return
  }
  if (queryResult.time == undefined) {
    alert("Is need run query before save or update.")
  } else {
    let queryName = prompt("Please enter your query name", "Untitled");
    if (!queryName) { return }
    let copy = { ...queryBuilderData.queryRequest }
    copy["schema"] = queryResult.schema
    copy["name"] = queryName
    copy["sql"] = queryResult.sql
    copy["json"] = copy["query_json"]
    copy["query_json"] = null
    queryService.saveQuery(copy).then((response) => {
      if(response.err) {
        alert(JSON.stringify(response.err))
        console.error(response.err)
      } else {
        console.log(response)
        let copyBuilder = { ...queryBuilderData }
        copyBuilder.queryRequest.name = queryName
        copyBuilder.isNewQuery = false
        setQueryBuilderData(copyBuilder)
      }
    })
  }
}