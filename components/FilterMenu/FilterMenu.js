import { SortableItem, SortableList } from "@omakase-ui/react-sortable-list"
import styles from "./FilterMenu.module.css"
import { useQueryBuilderContext } from "../../contexts/QueryBuilderContext"
import DragHandler from "../../utils/DragHandler"
import FilterComponent from "../FilterComponent/FilterComponent"
import uuidv4 from "../../utils/uuidGenerator"

export default function FilterMenu({...props}) {
    const {valuesUi, setValuesUi} = useQueryBuilderContext()
    let filters = valuesUi.filters

    const addFilter = (type = "FILTER") => {
        let copy = {...valuesUi}
        if (type != "GROUP") {
            copy.filters.push({
                type,
                id: uuidv4(),
                gate: "AND",
                left_column: "",
                condition: "",
                sub_condition: "",
                input_value: "",
                input_column: ""
            })
        } else {
            copy.filters.push({
                type,
                id: uuidv4(),
                filters: [{
                    type: "FILTER",
                    id: uuidv4(),
                    gate: "AND",
                    left_column: "",
                    condition: "",
                    sub_condition: "",
                    input_value: "",
                    input_column: ""
                }],
                gate: "AND",
                left_column: "",
                condition: "",
                sub_condition: "",
                input_value: "",
                input_column: ""
            })
        }
        

        setValuesUi(copy)
    }
 
    return <>
        <div className={styles.header}>In this view, show records</div>
        <div className={styles.container_filters}>
             <SortableList items={filters} setItems={(newStatus) => {
                let copy = {...valuesUi}
                copy.filters = newStatus(filters)
                setValuesUi(copy)
                console.log(copy)
            }}>
            {({ items }) => (
            <div>
                {items.map((item, idx) => (
                    <div key={item.idx}>
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        DragHandler={DragHandler}
                        className={styles.filter}
                    >
                        <FilterComponent idxFilter={idx} filter={item} />
                    </SortableItem>
                    </div>
                ))}
            </div>
            )}
            </SortableList>
        </div>
        <div className={styles.buttons_controller}>
            <button className={styles.button} onClick={addFilter}>➕ Add filter</button>
            <button className={styles.button} onClick={() => addFilter("GROUP")}>➕ Add group filter</button>
        </div>
    </>
}