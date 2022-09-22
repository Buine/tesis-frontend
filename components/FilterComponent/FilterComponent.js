import { useMemo } from "react"
import ReactDatePicker from "react-datepicker"
import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import { handleFilterWithoutGroup } from "../../utils/HandleFilterSelect"
import styles from "./FilterComponent.module.css"
import "react-datepicker/dist/react-datepicker.css";
import { filtersByTypeData } from "../../utils/FilterByTypes"

export default function FilterComponent({ idxFilter, filter }) {
    const { valuesUi, setValuesUi } = useQueryBuilderContext()
    let columnsOptions = [{ name: "Select a column...", value: "" }, ...valuesUi.columns.map(column => { return { name: column.name, value: column.value, data_type: column.data_type } })]
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
            copy.filters.splice(idxFilter, 1)

            setValuesUi(copy)
        }
    }

    const setFilterParam = (param) => {
        return function (value) {
            let copy = { ...valuesUi }
            copy.filters[idxFilter][param] = value
            setValuesUi(copy)
        }
    }

    return <>
        <div className={styles.container}>
            {idxFilter == 0 && <div style={{ width: "67px" }}>Where</div>}
            {idxFilter != 0 &&
                <div>
                    <div style={{ maxWidth: "62px" }}><SelectSearch options={unionOptionsLogic} filterOptions={handleFilterWithoutGroup} value={filter.gate} onChange={setFilterParam("gate")} search /></div>
                </div>
            }
            <div style={{ maxWidth: "562px" }}><SelectSearch options={columnsOptions} filterOptions={handleFilterWithoutGroup} value={filter.left_column} onChange={setFilterParam("left_column")} search /></div>
            <div style={{ maxWidth: "562px" }}><SelectSearch options={filtersByTypeData[typeData]} filterOptions={handleFilterWithoutGroup} value={filter.condition} onChange={setFilterParam("condition")} search /></div>
            {typeInput == "COLUMN" && <div style={{ maxWidth: "562px" }}><SelectSearch options={columnsOptions.filter(column => column.data_type == typeData)} filterOptions={handleFilterWithoutGroup} value={filter.input_column} onChange={setFilterParam("input_column")} search /></div>}
            {typeInput == "INPUT" && <div><input className={styles.input} value={filter.input_value} onChange={(evt) => { setFilterParam("input_value")(evt.target.value) }}></input></div>}
            {typeInput == "SELECT" && <div><SelectSearch options={listSubConditions} filterOptions={handleFilterWithoutGroup} value={filter.sub_condition} onChange={(sub_condition) => {
                setFilterParam("sub_condition")(sub_condition)
                setFilterParam("input_value")("")
            }} search /></div>}
            {(typeInput == "SELECT" && subConditionInput == "DATEPICKER") && <div>
                <ReactDatePicker
                    selected={filter.input_value == "" ? new Date() : filter.input_value}
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
            <div style={{ cursor: "pointer", marginLeft: "2px" }} onClick={deleteFilter}>x</div>
        </div>
    </>
}