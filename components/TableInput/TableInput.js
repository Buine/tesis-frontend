import useQueryBuilderContext from "../../contexts/QueryBuilderContext";
import uuidv4 from "../../utils/uuidGenerator";
import styles from "../../styles/QueryBuilder.module.css"

export default function TableInput() {
    const [queryBuilderData, valuesUi, setValuesUi, dataUi, setDataUi] = useQueryBuilderContext()
    let schema = queryBuilderData.schema

    return (
        <>
            <MainTableInput/>
            <button>Add join</button>
        </>
    )
}

//-----------
function MainTableInput() {
    const [queryBuilderData, valuesUi, setValuesUi, dataUi, setDataUi] = useQueryBuilderContext()
    let schema = queryBuilderData.schema
    let idxComponent = -1 // For root in tables object

    return (
        <div className={styles.tables_container}>
            <label>From</label>
            <select name="table_initial" id="table_intial" onChange={(e) => setMainTable(e, valuesUi, setValuesUi, dataUi, setDataUi, schema, idxComponent)}>
                {getListTables(dataUi)}
            </select>
            <button 
                className={styles.add_filter}
                style={{color: 'black'}} 
                onClick={() => executeQuery(queryBuilderData, setQueryResult)}
            >Run Query</button>
        </div>
    )
}

function getListTables(dataUi) {
    return dataUi.availableTables.map((table, idx) => {
        return <option key={idx} indexInData={idx} value={table.name}>{table.name}</option>
    });
}

function setMainTable(e, valuesUi, setValuesUi, dataUi, setDataUi, schema, idxComponent) {
    let indexInData = e.target.indexInData
    console.log("Metadata idx in data: ", e.target.indexInData)
    let copyValueUi = {...valuesUi}
    copyValuesUi.tables.type = "TABLE" // TODO: Later first table is query change this
    copyValuesUi.tables.value = e.target.value,
    copyValuesUi.tables.joins = []
    let isDefault = valuesUi.tables.type == "DEFAULT"

    setValuesUi(copyValueUi)

    addColumnsFromTableInData(indexInData, schema, dataUi, setDataUi)
    if (!isDefault) { deleteColumnsFromTableInData(idxComponent, valuesUi, dataUi, setDataUi) }
}

function addColumnsFromTableInData(index, schema, dataUi, setDataUi) {
    let copyDataUi = {...dataUi}
    let tableInData = dataUi.availableTables[index]
    let tableInSchema = schema.schemas[tableInData.schemaIndex].tables[tableIndex]
    let idTable = uuidv4()
    let newColumns = tableInSchema.columns.map(column => {
        let [schema, table] = tableInData.name.split(".")
        return {
            from: `${schema}.${table}`,
            name: column.name,
            alias: null,            // TODO: Look later this
            id: idTable,
            type: column.data_type
        }
    })

    copyDataUi.availableColumns = [...copyDataUi.availableColumns, newColumns]

    setDataUi(copyDataUi)
}

function deleteColumnsFromTableInData(idxComponent, valuesUi, dataUi, setDataUi) {
    let currentId = idxComponent == -1 ? valuesUi.tables.id : valuesUi.tables.join[idxComponent]
    let copyDataUi = {...dataUi}
    copyDataUi.availableColumns = copyDataUi.availableColumns.filter((column) => column.id != currentId)
    
    setDataUi(copyDataUi)
}
//-----------


function TableJoinInput() {
    const [queryBuilderData, valuesUi, setValuesUi, dataUi, setDataUi] = useQueryBuilderContext()

}