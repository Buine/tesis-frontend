import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import styles from "./Filter.module.css"

export default function Filter({ key, id }) {
    const { queryBuilderData, setQueryBuilderData } = useQueryBuilderContext()
    let copyState = { ...queryBuilderData }
    let filters = copyState.queryRequest.query_json.filters
    let filter = copyState.queryRequest.query_json.filters[id]
    console.log(queryBuilderData, copyState, filter, id)
    let filterIsConfigure = filter ? filter.type != "DEFAULT" : false

    return (
        filter && <div className={styles.container}>
            <div className={styles.controller}>
                <select onChange={(e) => {
                    filter.gate_logic_previous = e.target.value
                    setQueryBuilderData(copyState)
                }}>
                    {generateLogicGatesOptions(id, filter)}
                </select>
                <p onClick={() => {
                    filters = filters.splice(id, 1);
                    setQueryBuilderData(copyState)
                }}>x</p>
            </div>
            <div className={styles.filter_type_container}>
                <label>Filter type</label>
                <select value={filter.type} onChange={(e) => {
                    filter.type = e.target.value
                    setQueryBuilderData(copyState)
                }}>
                    <option value="DEFAULT">Choose a filter</option>
                    <option value="EQ">(=) Equal</option>
                    <option value="NOT_EQ">(!=) Not Equal</option>
                    <option value="ILIKE">(LIKE) Contains</option>
                    <option value="GREATER">({`>`}) Greater</option>
                    <option value="GREATER_EQ">({`>=`}) Greater equal</option>
                    <option value="LESS">({`<`}) Less</option>
                    <option value="LESS_EQ">({`<=`}) Less equal</option>
                </select>
            </div>
            {filterIsConfigure && generateFilterContainer(id, filter, setQueryBuilderData)}
        </div>
    )
}

function generateLogicGatesOptions(id, filter) {
    let logicGates = [
        <option key="AND" value={"AND"}>And</option>,
        <option key="OR" value={"OR"}>Or</option>
    ]
    if (id == 0) {
        logicGates = <option value={null}>When</option>
    }
    if (filter.type == "GROUP") {
        logicGates = <option value="GROUP">Group</option>
    }

    return logicGates
}

function generateFilterContainer(id, filter, setQueryBuilderData) {
    return (
        <div className={styles.filter_container}>
            <Param id={0} filterId={id} />
            <div className={styles.filter_operator}><p> = </p></div>
            <Param id={1} filterId={id} />
        </div>
    )
}


// TODO: Move to another file into components folder
function Param({ id, filterId }) {
    const { queryBuilderData, setQueryBuilderData } = useQueryBuilderContext()
    let copyState = { ...queryBuilderData }
    let params = copyState.queryRequest.query_json.filters[filterId].params
    let currentParam = copyState.queryRequest.query_json.filters[filterId].params[id]
    let isColumn = currentParam ? currentParam.type == "COLUMN" : true


    // TODO: Move logic (render select or input) to a function
    return (
        <div className={styles.filter_param}>
            <select value={getParamSelectValue(currentParam)} onChange={(e) => configureParamFilter(e, copyState, currentParam, setQueryBuilderData)}>
                <option value={"COLUMN.TABLE"}>Column (table)</option>
                <option value={"COLUMN.QUERY"}>Column (query)</option>
                <option value={"PARAM.TEXT"}>Input (Text)</option>
                <option value={"PARAM.DATE"}>Input (Date)</option>
                <option value={"PARAM.NUMBER"}>Input (Number)</option>
                <option value={"FUNCTION.NOW"}>Function (NOW())</option>
            </select>
            {isColumn && <select value={getTableColumnSelectValue(currentParam)} onChange={(e) => setTableColumnSelectValue(e, copyState, currentParam, setQueryBuilderData)}>{getSelectTableColumns(queryBuilderData)}</select>}
            {!isColumn && <input value={currentParam.param.value} onChange={(e) => {
                currentParam.param.value = e.target.value
                setQueryBuilderData(copyState)
            }}></input>}
        </div>
    )
}

function getSelectTableColumns(queryBuilderData) {
    let tablesInSchema = queryBuilderData.tablesInSchema
    return tablesInSchema.map(item => {
        let schema = queryBuilderData.schema.schemas[item.schema]
        let table = schema.tables[item.table] 
        let currentTableColumns = table.columns
        return currentTableColumns.map(column => {
            let columnName = `${schema.name}.${table.name}.${column.name}`
            return <option value={columnName} key={columnName}>{columnName}</option>
        })
    })
} 

function configureParamFilter(e, copyState, currentParam, setQueryBuilderData) {
    let [type, subType] = e.target.value.split(".")
    console.log(type, subType)
    if (type == "COLUMN") {
        currentParam.type = type 
        currentParam.param = null
        currentParam.table_column = {
            query_column: subType == "QUERY"
        }
    } else {
        let isFunction = type == "FUNCTION"
        currentParam.type = "PARAM" 
        currentParam.table_column = null
        currentParam.param = {
            type_input: isFunction ? "FUNCTION" : subType,
            input_function: isFunction ? "NOW" : null,
            value: ""
        }
    }
    setQueryBuilderData(copyState)
    console.log(currentParam)
}

function getParamSelectValue(currentParam) {
    console.log(`CurrentParam: ${JSON.stringify(currentParam)}`)
    let selectValue = currentParam.type
    if (selectValue == "COLUMN") {
        selectValue = `${selectValue}.${currentParam.table_column.query_column ? "QUERY" : "TABLE"}`
    } else if (selectValue == "PARAM") {
        let isFunction = currentParam.param.type_input == "FUNCTION"
        if (isFunction) {
            selectValue = `FUNCTION.${currentParam.param.input_function}`
        } else {
            selectValue = `${selectValue}.${currentParam.param.type_input}`
        }
    }
    console.log(selectValue)

    return selectValue
}

function setTableColumnSelectValue(e, copyState, currentParam, setQueryBuilderData) {
    const [schema, table, column] = e.target.value.split(".")
    currentParam.table_column.schema_name = schema
    currentParam.table_column.table_name = table
    currentParam.table_column.column_name = column

    setQueryBuilderData(copyState)
}

function getTableColumnSelectValue(currentParam) {
    let tableColumnParam = currentParam.table_column
    return `${tableColumnParam.schema_name}.${tableColumnParam.table_column}.${tableColumnParam.column_name}`
}

