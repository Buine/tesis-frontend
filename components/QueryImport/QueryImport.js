import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext";
import InfoIcon from "../../utils/svg/InfoIcon";
import ContainerDropdownV2 from "../ContainerDropdownV2/ContainerDropdownV2"
import styles from "./QueryImport.module.css"

const textByTypes = {
    "MAIN": "Main table source:",
    "TABLE": "Merge table:",
    "QUERY": "Merge query:"
}

const TableTypes = ["MAIN", "TABLE"]

const options = [
  {
    type: "group",
    name: "public",
    items: [
      { name: "integration", value: "1" },
      { name: "users", value: "2" }
    ]
  },
  {
    type: "group",
    name: "admin",
    items: [
      { name: "user_group", value: "3" },
    ]
  }
];

const handleFilter = (items) => {
  return (searchValue) => {
    if (searchValue.length === 0) {
      return items;
    }
    let updatedItems = []
    items.forEach((list) => {
      if (list.items == undefined) { return }
      const newItems = list.items.filter((item) => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      updatedItems.push({ ...list, items: newItems });
    });
    return updatedItems;
  };
}; 

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
        copy.tables = [{type, value, alias: ""}]
      } else {
        if (copy.tables[idxImport] == undefined) {
          copy.tables[idxImport] = {type, value, alias: ""}
        } else {
          copy.tables[idxImport].value = value
        }
      }
      console.log(valuesUi)
      
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
                    let [schema, table] = join.value.split(".")
                    return `${schema}.${table}` == imports[idxImport].value
                  }
                  return false
                })
                return searchDependency.length > 0
              }
              return false
            })
          }
          if (dependecies.length == 0) {
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
            currentTable.join = isColumnTableImport ? [{value: value}, {value: null}] : [{value: null}, {value: value}]
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
                value: `${idxSchema}.${idxTable}.${idxColumn}`
              })
            })
            listAvailableColumns.push({
              type: "group",
              name: table.alias,
              items: listColumns
            })
          } else {
            // TODO: Pending implement logic here (queries)...

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
                        options={options}
                        filterOptions={handleFilter}
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