import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext";
import integrationService from "../../services/integrations";
import { handleFilter } from "../../utils/HandleFilterSelect";
import MapperTypeDbToPrimitive from "../../utils/MapperTypeDatabaseToPrimitive";
import InfoIcon from "../../utils/svg/InfoIcon";
import uuidv4 from "../../utils/uuidGenerator";
import ContainerDropdownV2 from "../ContainerDropdownV2/ContainerDropdownV2"
import styles from "./QueryImport.module.css"

const textByTypes = {
    "MAIN": "Main table source:",
    "TABLE": "Merge table:",
    "QUERY": "Merge query:"
}

const TableTypes = ["MAIN", "TABLE"]

export function GenerateColumns(value, idxImport, copy, queryBuilderData) {
  copy.columns = copy.columns.filter(column => column.import_id != copy.tables[idxImport].id)
  copy.columns.forEach((column, idx) => column.id = idx+1)

  let newColumnId = copy.columns.length+1
  let [schema, table] = value.split(".")
  let columns = queryBuilderData.schema.schemas[schema].tables[table].columns
  let newColumns = []
  columns.forEach((column, idx) => {
    newColumns.push({
      id: newColumnId+idx,
      name: `${copy.tables[idxImport].alias}.${column.name}`,
      alias: copy.tables[idxImport].alias,
      value: `${schema}.${table}.${idx}.${copy.tables[idxImport].id}`,
      import_id: copy.tables[idxImport].id,
      data_type: MapperTypeDbToPrimitive(column.data_type),
      status: true,
      type: "COLUMN"
    })
  })
  copy.columns = [...copy.columns, ...newColumns]
}

export async function GenerateQueryColumns(value, idxImport, copy, queryBuilderData) {
  copy.columns = copy.columns.filter(column => column.import_id != copy.tables[idxImport].id)
  copy.columns.forEach((column, idx) => column.id = idx+1)

  let newColumnId = copy.columns.length+1
  let columns = await getSchemaByQuery(queryBuilderData.queryRequest.integration_code, value)
  let newColumns = []
  columns.schema.forEach((column, idx) => {
    newColumns.push({
      id: newColumnId+idx,
      name: `${copy.tables[idxImport].alias}.${column.name}`,
      only_name: column.name,
      alias: copy.tables[idxImport].alias,
      value: `${value}.${copy.tables[idxImport].id}.${newColumnId+idx}`,
      import_id: copy.tables[idxImport].id,
      data_type: MapperTypeDbToPrimitive(column.data_type),
      status: true,
      type: "QUERY"
    })
  })
  copy.columns = [...copy.columns, ...newColumns]
}

export default function QueryImport({type, idxImport = 0}) {
    const { queryBuilderData, dataUi, valuesUi, setValuesUi } = useQueryBuilderContext()
    let title = textByTypes[type]
    let isMain = type == "MAIN"
    let isQuery = type == "QUERY"
    
    const getTableParam = (param = "value") => {
      if (valuesUi.tables) {
        if (valuesUi.tables[idxImport]) {
          return valuesUi.tables[idxImport][param]
        }
      }
      return null
    }
    
    const setNativeTableValue = (value) => {
      if (value == null || value == undefined) { return }
      let copy = {...valuesUi}
      if (copy.tables == undefined) {
        copy.tables = [{type, value, alias: "", id: uuidv4()}]
      } else {
        if (copy.tables[idxImport] == undefined) {
          copy.tables[idxImport] = {type, value, alias: "", id: uuidv4()}
        } else {
          copy.tables[idxImport].value = value
        }
      }

      // Generate columns
      GenerateColumns(value, idxImport, copy, queryBuilderData)

      console.log(copy)
      
      setValuesUi(copy)
    }

    const setQueryTableValue = (value) => {
      if (value == null || value == undefined) { return }
      let copy = {...valuesUi}
      if (copy.tables == undefined) {
        copy.tables = [{type, value, alias: "", id: uuidv4()}]
      } else {
        copy.tables[idxImport].value = value
      }

      GenerateQueryColumns(value, idxImport, copy, queryBuilderData)

      console.log(copy)

      setValuesUi(copy)
    }

    const deleteImport = () => {
      let validation = confirm("Are you sure you delete the data import?")
      if (validation == false) { return }
      let copy = {...valuesUi}
      let imports = copy.tables
      if (imports) {
        if (imports[idxImport]) {
          let dependecies = []
          if (imports[idxImport].value){
            dependecies = imports.filter((tableImport, idx) => {
              if (tableImport.join && idx != idxImport) {
                let searchDependency = tableImport.join.filter((join) => {
                  if (join.value) {
                    let [schema, table, _, id] = join.value.split(".")
                    return `${schema}.${table}` == imports[idxImport].value && id == imports[idxImport].id
                  }
                  return false
                })
                return searchDependency.length > 0
              }
              return false
            })
          }
          if (dependecies.length == 0) {
            copy.columns = copy.columns.filter(column => column.import_id != copy.tables[idxImport].id)
            copy.columns.forEach((column, idx) => column.id = idx+1)
            imports = imports.splice(idxImport, 1)
            setValuesUi(copy)
          } else {
            alert("It was not possible to delete because it has a dependency with the import of other tables.")
          }
        }
      }
    }

    const setAliasTableValue = (evt) => {
      let alias = evt.target.value
      let copy = {...valuesUi}
      if (copy.tables == undefined) {
        copy.tables = [{type, value: null, alias}]
      } else {
        if (copy.tables[idxImport] == undefined) {
          copy.tables[idxImport] = {type, value: null, alias}
        } else {
          copy.tables[idxImport].alias = alias
        }
      }

      //Rename alias columns
      copy.columns.forEach(column => {
        if (column.import_id == copy.tables[idxImport].id) {
          if (column.alias == '') {
            column.name = `${alias}${column.name}`
          } else {
            column.name = column.name.replace(column.alias, alias)
          }
          column.alias = alias
        }
      })

      console.log(copy)
      
      setValuesUi(copy)
    }

    const setJoinTableValue = (value, isColumnTableImport) => {
      let copy = {...valuesUi}
      let idxJoin = isColumnTableImport ? 0 : 1
      let tables = copy.tables
      if (tables) {
        let currentTable = tables[idxImport]
        if (currentTable) {
          if (currentTable.join) {
            currentTable.join[idxJoin].value = value
          } else {
            currentTable.join = isColumnTableImport ? [{value: value, idxImport}, {value: null}] : [{value: null}, {value: value}]
          }
        }
      }

      setValuesUi(copy)
    }

    const getJoinTableValue = (isColumnTableImport) => {
      let tables = valuesUi.tables
      let idxJoin = isColumnTableImport ? 0 : 1
      if (tables) {
        if (tables[idxImport]) {
          if (tables[idxImport].join) {
            return tables[idxImport].join[idxJoin].value
          }
        }
      }
      return null
    }

    const getAvailableColumns = (specificTableIdx, ignoreSpecificTableIdx) => {
      let listAvailableColumns = [{name: "Select a column...", value: null}]
      if (queryBuilderData.schema == undefined) { return listAvailableColumns }
      let schemas = queryBuilderData.schema.schemas

      let importedTables = valuesUi.tables
      if (importedTables && schemas) {
        importedTables.forEach((table, idxUiTable) => {
          if (table.value == null) return

          if (ignoreSpecificTableIdx == idxUiTable) { return }
          if (specificTableIdx != undefined && specificTableIdx != idxUiTable) { return }

          if (TableTypes.includes(table.type)) {
            let listColumns = []
            let [idxSchema, idxTable] = table.value.split(".")
            let currentTableColumns = schemas[idxSchema].tables[idxTable].columns
            currentTableColumns.forEach((currentColumn, idxColumn) => {
              listColumns.push({
                name: currentColumn.name,
                value: `${idxSchema}.${idxTable}.${idxColumn}.${table.id}`,
                type: "COLUMN"
              })
            })
            listAvailableColumns.push({
              type: "group",
              name: table.alias,
              items: listColumns
            })
          } else {
            // TODO: Pending implement logic here (queries)... in progress
            let listColumns = valuesUi.columns.filter(column => {
              return column.import_id == table.id
            }).map(
              column => { return {
                name: column.name,
                value: column.value,
                type: "QUERY"
              } }
            )
            listAvailableColumns.push({
              type: "group",
              name: table.alias,
              items: listColumns
            })
          }
        })
      }
      
      return listAvailableColumns
    }

    return (
        <ContainerDropdownV2 title={title} subtitle={getTableParam("alias") ? getTableParam("alias") : "Integration"}>
            <div className={styles.container}>
                <div className={styles.input_div}>
                    {!isQuery && <><label>Table</label>
                    <SelectSearch 
                        options={dataUi.listNativeTables}
                        filterOptions={handleFilter}
                        onChange={setNativeTableValue}
                        value={getTableParam()}
                        autoFocus={false}
                        search
                    /></>}
                    {isQuery && <><label>Query</label>
                    <SelectSearch 
                        options={dataUi.listQueries}
                        filterOptions={handleFilter}
                        value={valuesUi.tables[idxImport].value}
                        onChange={setQueryTableValue}
                        autoFocus={false}
                        search
                    /></>}
                </div>
                <div className={styles.input_div}>
                    <label>Alias*</label>
                    <input 
                      className={styles.input}
                      value={getTableParam("alias")}
                      onChange={setAliasTableValue}
                    />
                </div>
                {!isMain && <div className={styles.input_div}>
                    <div className={styles.label_alt_title}>
                        <label>Merge data condition</label>
                        <InfoIcon />
                    </div>
                    
                    <div className={styles.condition_div}>
                        <div className={styles.condition_style_div}>
                            <div className={styles.corner_left_top}></div>
                            🔗
                            <div className={styles.corner_left_bottom}></div>
                        </div>
                        <div className={styles.condition_inputs_div}>
                            <div className={styles.condition_select}>
                                <SelectSearch 
                                    options={getAvailableColumns(idxImport, undefined)}
                                    filterOptions={handleFilter}
                                    onChange={value => setJoinTableValue(value, true)}
                                    value={getJoinTableValue(true)}
                                    search
                                />
                            </div>
                            
                            <div className={styles.condition_select}>
                                <SelectSearch 
                                    options={getAvailableColumns(undefined, idxImport)}
                                    onChange={value => setJoinTableValue(value, false)}
                                    filterOptions={handleFilter}
                                    value={getJoinTableValue(false)}
                                    search
                                />
                            </div>
                        </div>
                    </div>
                </div>}
                { idxImport != 0 && <div className={styles.input_div}>
                  <button 
                    className={styles.delete_button}
                    onClick={deleteImport}
                  >╳ Delete</button>
                </div> }
            </div>
        </ContainerDropdownV2>
    )
}

const getSchemaByQuery = async (code, query) => {
  const response = await integrationService.getSchemaByQuery(code, query)
  return response.res
}
