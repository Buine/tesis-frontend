import { SortableItem, SortableList } from "@omakase-ui/react-sortable-list"
import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import DragHandler from "../../utils/DragHandler"
import { handleFilterWithoutGroup } from "../../utils/HandleFilterSelect"
import uuidv4 from "../../utils/uuidGenerator"
import styles from "./GroupByComponent.module.css"

export default function GroupByComponent() {
    const { valuesUi, setValuesUi } = useQueryBuilderContext()
    let columnsOptions = [{ name: "Select a column...", value: "" }, ...valuesUi.columns.map(column => { return { column, name: column.name, value: column.value, data_type: column.data_type } })]
    let aggregateFunctionsOptions = [{ name: "Select a aggregative function...", value: "" }, {name: "Sum", value: "SUM"}, {name: "Average", value: "AVG"}, {name: "Count", value: "COUNT"}, {name: "Max", value: "MAX"}, {name: "Min", value: "MIN"}]

    const createNewGroup = () => {
        let copy = { ...valuesUi }
        copy.groups.push(
            {
                id: uuidv4(),
                value: "",
                name: "",                
            }
        )

        setValuesUi(copy)
    }

    const setGroupParameter = (idx, parameter, value) => {
        let copy = { ...valuesUi }
        copy.groups[idx][parameter] = value

        if (copy.groups[idx].value) {
            updateAlternativeColumns(false, copy.groups[idx].id, idx, copy)
        }

        setValuesUi(copy)
    }

    const deleteGroup = (idx) => {
        let copy = { ...valuesUi }
        if (copy.groups.length == 1) {
            let question = confirm("If you wish to continue, all the aggregative functions will be eliminated since they require at least one grouped field.")
            if (!question) { return }
            copy.alternativeColumns = []
            copy.aggFunctions = []  
        }
        copy.alternativeColumns = copy.alternativeColumns.filter((c) => c.id_ext != valuesUi.groups[idx].id )
        copy.groups.splice(idx)
        console.log(copy.groups)
        setValuesUi(copy)
    }

    const createNewAggFunction = () => {
        let copy = { ...valuesUi }
        if (copy.groups.length == 0) {
            alert("It is necessary to have at least group by a field to use aggregation functions")
            return
        }
        copy.aggFunctions.push(
            {
                id: uuidv4(),
                value: "",
                name: "",
                function: "",                
            }
        )

        setValuesUi(copy)
    }

    const setAggFunctionParameter = (idx, parameter, value) => {
        let copy = { ...valuesUi }
        copy.aggFunctions[idx][parameter] = value

        if (copy.aggFunctions[idx].value && copy.aggFunctions[idx].function) {
            updateAlternativeColumns(true, copy.aggFunctions[idx].id, idx, copy)
        }

        setValuesUi(copy)
    }

    const updateAlternativeColumns = (isFunctionColumn, id, idx, copy) => {
        let columnId = isFunctionColumn ? valuesUi.aggFunctions[idx].value : valuesUi.groups[idx].value
        let column = columnsOptions.filter((c) => c.value == columnId)
        if (column.length > 0) {
            let currentColumn = column[0]
            copy.alternativeColumns = copy.alternativeColumns.filter((c) => c.id_ext != id)
            if (isFunctionColumn) {
                copy.alternativeColumns.push({
                    ...currentColumn.column,
                    id_ext: id,
                    alternativeName: `${valuesUi.aggFunctions[idx].function} of ${currentColumn.column.name}`,
                    type: "GENERATED",
                    function: valuesUi.aggFunctions[idx].function
                })
                console.log("function agg", currentColumn)
                console.log("alternative columns", copy.alternativeColumns)
            } else {
                copy.alternativeColumns.push({ id_ext: id, ...currentColumn.column})
                console.log("field group by", currentColumn)
                console.log("alternative columns", copy.alternativeColumns)
            }
        }
    }

    return <>
        <div className={styles.header}>In this view, group by</div>
        <div className={styles.container_sorts}>
        <SortableList items={valuesUi.groups} setItems={(newStatus) => {
                let copy = {...valuesUi}
                copy.groups = newStatus(valuesUi.groups)
                setValuesUi(copy)
            }}>
                {({items}) => (
                    items.map((group, idx) => {
                        return <SortableItem
                            key={group.id}
                            id={group.id}
                            DragHandler={DragHandler}
                            className={styles.sort_handler}
                        >
                            <div className={styles.sort_div}>
                                <SelectSearch 
                                    options={columnsOptions} 
                                    value={valuesUi.groups[idx].value ? valuesUi.groups[idx].value : ""}
                                    onChange={(column) => {
                                    setGroupParameter(idx, "value", column)
                                }} filterOptions={handleFilterWithoutGroup} search />
                                <div className={styles.action_sort} style={{marginRight: "10px"}} onClick={() => {
                                    deleteGroup(idx)
                                }}>x</div>
                            </div>
                        </SortableItem>
                }))
            }
        </SortableList>
        </div>
        <div className={styles.buttons_controller}>
            <button className={styles.button} onClick={() => { createNewGroup() }}>➕ Add group by field</button>
        </div>

        <div style={{marginTop: "15px"}} className={styles.header}>and added columns aggregate</div>
        <div className={styles.container_sorts}>
        <SortableList items={valuesUi.aggFunctions} setItems={(newStatus) => {
                let copy = {...valuesUi}
                copy.aggFunctions = newStatus(valuesUi.aggFunctions)
                setValuesUi(copy)
            }}>
                {({items}) => (
                    items.map((aggFunction, idx) => {
                        return <SortableItem
                            key={aggFunction.id}
                            id={aggFunction.id}
                            DragHandler={DragHandler}
                            className={styles.sort_handler}
                        >
                            <div className={styles.sort_div}>
                                <SelectSearch 
                                    options={columnsOptions} 
                                    value={valuesUi.aggFunctions[idx].value ? valuesUi.aggFunctions[idx].value : ""}
                                    onChange={(column) => {
                                    setAggFunctionParameter(idx, "value", column)
                                }} filterOptions={handleFilterWithoutGroup} search />
                                <SelectSearch 
                                    options={aggregateFunctionsOptions} 
                                    value={valuesUi.aggFunctions[idx].function ? valuesUi.aggFunctions[idx].function : ""}
                                    onChange={(aggFunction) => {
                                    setAggFunctionParameter(idx, "function", aggFunction)
                                }} filterOptions={handleFilterWithoutGroup} search />
                                <div className={styles.action_sort} style={{marginRight: "10px"}} onClick={() => {
                                    let copy = {...valuesUi}
                                    copy.alternativeColumns = copy.alternativeColumns.filter((c) => c.id_ext != valuesUi.aggFunctions[idx].id)
                                    copy.aggFunctions.splice(idx)
                                    console.log(copy.aggFunctions)
                                    setValuesUi(copy)
                                }}>x</div>
                            </div>
                        </SortableItem>
                }))
            }
        </SortableList>
        </div>
        <div className={styles.buttons_controller}>
            <button className={styles.button} onClick={() => { createNewAggFunction() }}>➕ Add aggreate column function</button>
        </div>
    </>
}