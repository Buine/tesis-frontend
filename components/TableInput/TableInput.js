import useQueryBuilderContext from "../../contexts/QueryBuilderContext";
import uuidv4 from "../../utils/uuidGenerator";
import styles from "../../styles/QueryBuilder.module.css"

export default function TableInput() {
    return (
        <>
            <MainTableInput/>
            <button>Add join</button>
        </>
    )
}

//-----------
function MainTableInput() {
    const {queryBuilderData, valuesUi, setValuesUi, dataUi, setDataUi} = useQueryBuilderContext()
    let schema = queryBuilderData.schema
    let idxComponent = -1 // For root in tables object
    console.log(dataUi.availableColumns)

    return (
        <div className={styles.tables_container}>
            <label>From</label>
            <select name="table_initial" id="table_intial" value={valuesUi.tables.name} onChange={(e) => setMainTable(e, valuesUi, setValuesUi, dataUi, setDataUi, schema, idxComponent)}>
                <option value="DEFAULT">Select a table for start</option>
                {getListTables(dataUi)}
            </select>
        </div>
    )
}

function getListTables(dataUi) {
    return dataUi.availableTables.map((table, idx) => {
        return <option key={idx} value={table.name}>{table.name}</option>
    });
}

function setMainTable(e, valuesUi, setValuesUi, dataUi, setDataUi, schema, idxComponent) {
    let indexInData = e.target.selectedIndex-1
    let copyValuesUi = {...valuesUi}
    let isDefault = valuesUi.tables.type == "DEFAULT"
    console.log(valuesUi.tables)
    if (!isDefault) { deleteColumnsFromTableInData(idxComponent, valuesUi, dataUi, setDataUi) }
    
    let idTable = uuidv4()
    copyValuesUi.tables.type = "TABLE" // TODO: Later first table is query change this
    copyValuesUi.tables.value = e.target.value,
    copyValuesUi.tables.joins = []
    copyValuesUi.tables.id = idTable

    setValuesUi(copyValuesUi)

    if (indexInData >= 0) { addColumnsFromTableInData(indexInData, schema, dataUi, setDataUi, idTable) }
}

function addColumnsFromTableInData(index, schema, dataUi, setDataUi, idTable) {
    let tableInData = dataUi.availableTables[index]
    let tableInSchema = schema.schemas[tableInData.schemaIndex].tables[tableInData.tableIndex]
    let copyDataUi = {...dataUi}
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

    copyDataUi.availableColumns = [...copyDataUi.availableColumns, ...newColumns]

    setDataUi(copyDataUi)
}

function deleteColumnsFromTableInData(idxComponent, valuesUi, copyDataUi, setDataUi) {
    let currentId = idxComponent == -1 ? valuesUi.tables.id : valuesUi.tables.join[idxComponent]
    copyDataUi.availableColumns = copyDataUi.availableColumns.filter((column) => column.id != currentId)
    console.log(currentId, copyDataUi.availableColumns)
    
    setDataUi(copyDataUi)
}
//-----------


function TableJoinInput() {
    const {queryBuilderData, valuesUi, setValuesUi, dataUi, setDataUi} = useQueryBuilderContext()

}