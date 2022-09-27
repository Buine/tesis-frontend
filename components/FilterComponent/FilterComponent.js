import { useMemo } from "react"
import ReactDatePicker from "react-datepicker"
import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import { handleFilterWithoutGroup } from "../../utils/HandleFilterSelect"
import styles from "./FilterComponent.module.css"
import "react-datepicker/dist/react-datepicker.css";
import { filtersByTypeData } from "../../utils/FilterByTypes"
import uuidv4 from "../../utils/uuidGenerator"
import { SortableItem, SortableList } from "@omakase-ui/react-sortable-list"
import DragHandler from "../../utils/DragHandler"

export default function FilterComponent({ idxFilter, filter, idxParentFilter = undefined }) {
    const { valuesUi, setValuesUi } = useQueryBuilderContext()
    let columnsOptions = [{ name: "Select a column...", value: "" }, ...valuesUi.columns.map(column => { return { name: column.name, value: column.value, data_type: column.data_type } })]
    let filterIsGroup = filter.type == "GROUP"
    let idxLeftColumn = columnsOptions.findIndex(column => column.value == filter.left_column)
    let typeData = idxLeftColumn > 0 ? columnsOptions[idxLeftColumn].data_type : "TEXT"
    let typeInput = useMemo(() => {
        let splitCondition = filter.condition.split("_")
        if (splitCondition[splitCondition.length-1] == "INPUT") {
            return "INPUT"
        } else if (splitCondition[splitCondition.length-1] == "COLUMN") {
            return "COLUMN"
        } else if (splitCondition[splitCondition.length-1] == "SELECT") {
            return "SELECT"
        }
        return "FINAL"
    }, [filter.condition])

    const unionOptionsLogic = [{ name: "and", value: "AND" }, { name: "or", value: "OR" }]
    

    let conditionIdx = filtersByTypeData["DATE"].findIndex(condition => condition.value == filter.condition)
    let listSubConditions = conditionIdx > 0 ? filtersByTypeData["DATE"][conditionIdx].select : []
    let subConditionInput = useMemo(() => {
        let splitCondition = filter.sub_condition.split("_")
        if (splitCondition[splitCondition.length-1] == "DATEPICKER") {
            return "DATEPICKER"
        } else if (splitCondition[splitCondition.length-1] == "INPUT") {
            return "INPUT"
        }
        return "FINAL"
    }, [filter.sub_condition])

    const deleteFilter = () => {
        if (confirm("Do you want to remove the filter?")) {
            let copy = { ...valuesUi }
            if (idxParentFilter != undefined) {
                copy.filters[idxParentFilter].filters.splice(idxFilter, 1)
                if (copy.filters[idxParentFilter].filters.length == 0) {
                    copy.filters.splice(idxParentFilter, 1)
                }
            } else {
                copy.filters.splice(idxFilter, 1)
            }

            setValuesUi(copy)
        }
    }

    const setFilterParam = (param) => {
        return function (value) {
            let copy = { ...valuesUi }
            if (idxParentFilter != undefined) {
                copy.filters[idxParentFilter].filters[idxFilter][param] = value
            } else {
                copy.filters[idxFilter][param] = value
            }

            setValuesUi(copy)
        }
    }

    const addFilter = () => {
        let copy = {...valuesUi}
        copy.filters[idxFilter].filters.push({
            type: "FILTER",
            id: uuidv4(),
            gate: "AND",
            left_column: "",
            condition: "",
            sub_condition: "",
            input_value: "",
            input_column: ""
        })

        setValuesUi(copy)
    }

    return <>
        <div className={styles.container}>
            { idxFilter == 0 && <div style={{ width: "67px" }}>Where</div>}
            {idxFilter != 0 &&
                <div>
                    <div style={{ maxWidth: "62px" }}><SelectSearch options={unionOptionsLogic} filterOptions={handleFilterWithoutGroup} value={filter.gate} onChange={setFilterParam("gate")} search /></div>
                </div>
            }
            {
                filterIsGroup && <>
                    <div style={{display: "flex", flexDirection: "column", background: "rgb(210 210 210)", padding: "1em", margin: "2px 8px 2px 0px"}}>           
                        <SortableList items={filter.filters} setItems={(newStatus) => {
                            let copy = {...valuesUi}
                            copy.filters[idxFilter].filters = newStatus(filter.filters)
                            setValuesUi(copy)
                        }}>
                            {({items}) => (
                                items.map((currentFilter, idx) => {
                                    return <SortableItem
                                        key={currentFilter.id}
                                        id={currentFilter.id}
                                        DragHandler={DragHandler}
                                        className={styles.filter}
                                    >
                                        <FilterComponent idxFilter={idx} filter={currentFilter} idxParentFilter={idxFilter} key={idx} />
                                    </SortableItem>
                                    
                                }))
                            }
                        </SortableList>
                        {/* {filter.filters.map((currentFilter, idx) => {
                            return <FilterComponent idxFilter={idx} filter={currentFilter} idxParentFilter={idxFilter} key={idx} />
                        })}  */}
                        <button className={styles.button} style={{marginTop: "8px"}} onClick={addFilter}>Add filter</button>
                    </div>
                </>
            }
            {filterIsGroup === false && <>
                <div style={{ maxWidth: "562px" }}><SelectSearch options={columnsOptions} filterOptions={handleFilterWithoutGroup} value={filter.left_column} onChange={(left_column) => {
                    setFilterParam("left_column")(left_column)
                    setFilterParam("condition")("")
                }} search /></div>
                <div style={{ maxWidth: "562px" }}><SelectSearch options={filtersByTypeData[typeData]} filterOptions={handleFilterWithoutGroup} value={filter.condition} onChange={(condition) => {
                    setFilterParam("condition")(condition)
                    setFilterParam("input_value")("")
                }} search /></div>
                
                {typeInput == "COLUMN" && <div style={{ maxWidth: "562px" }}><SelectSearch options={columnsOptions.filter(column => column.data_type == typeData)} filterOptions={handleFilterWithoutGroup} value={filter.input_column} onChange={setFilterParam("input_column")} search /></div>}
                {typeInput == "INPUT" && <div><input className={styles.input} value={filter.input_value} onChange={(evt) => { setFilterParam("input_value")(evt.target.value) }}></input></div>}
                {typeInput == "SELECT" && <div><SelectSearch options={listSubConditions} filterOptions={handleFilterWithoutGroup} value={filter.sub_condition} onChange={(sub_condition) => {
                    setFilterParam("sub_condition")(sub_condition)
                    setFilterParam("input_value")("")
                }} search /></div>}
                
                {(typeInput == "SELECT" && subConditionInput == "DATEPICKER") && <div>
                    <ReactDatePicker
                        selected={filter.input_value == "" ? (() => {
                            setFilterParam("input_value")(new Date())
                            return new Date()
                        })() : filter.input_value}
                        onChange={(date) => setFilterParam("input_value")(date)}
                        showTimeSelect
                        timeFormat="p"
                        timeIntervals={5}
                        dateFormat="Pp"
                    />
                </div>}
                {(typeInput == "SELECT" && subConditionInput == "INPUT") && <div>
                    <input className={styles.input} value={filter.input_value} onChange={(evt) => { setFilterParam("input_value")(evt.target.value) }} />
                </div>}
            </>}
            <div style={{ cursor: "pointer", marginLeft: "2px" }} onClick={deleteFilter}>x</div>
        </div>
    </>
}