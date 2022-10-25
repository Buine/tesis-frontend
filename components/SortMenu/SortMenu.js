import { SortableItem, SortableList } from "@omakase-ui/react-sortable-list"
import SelectSearch from "react-select-search"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import DragHandler from "../../utils/DragHandler"
import { handleFilterWithoutGroup } from "../../utils/HandleFilterSelect"
import uuidv4 from "../../utils/uuidGenerator"
import styles from "./SortMenu.module.css"

export default function SortMenu() {
    const { valuesUi, setValuesUi } = useQueryBuilderContext()
    let columnsOptions = [{ name: "Select a column...", value: "" }, ...valuesUi.columns.map(column => { return { name: column.name, value: column.value, data_type: column.data_type } })]
    let sortOptions = [{name: "ASC", value: "ASC"}, {name: "DESC", value: "DESC"}]

    const createNewSort = () => {
        let copy = { ...valuesUi }
        copy.sorts.push(
            {
                id: uuidv4(),
                value: "",
                name: "",
                direction: "ASC"
            }
        )
        console.log(copy)

        setValuesUi(copy)
    }

    const setSortParameter = (idx, parameter, value) => {
        let copy = {...valuesUi}
        copy.sorts[idx][parameter] = value

        setValuesUi(copy)
    }

    return <>
        <div className={styles.header}>In this view, sorted by</div>
        <div className={styles.container_sorts}>
            <SortableList items={valuesUi.sorts} setItems={(newStatus) => {
                    let copy = {...valuesUi}
                    copy.sorts = newStatus(valuesUi.sorts)
                    setValuesUi(copy)
                }}>
                    {({items}) => (
                        items.map((sort, idx) => {
                            return <SortableItem
                                key={sort.id}
                                id={sort.id}
                                DragHandler={DragHandler}
                                className={styles.sort_handler}
                            >
                                <div className={styles.sort_div} key={idx}>
                                    <div className={styles.sort_column_div}><SelectSearch options={columnsOptions} value={sort.value} onChange={(column) => {
                                        console.log("Holis", column)
                                        setSortParameter(idx, "value", column)
                                    }} filterOptions={handleFilterWithoutGroup} search /></div>
                                    <div className={styles.sort_option_div}><SelectSearch options={sortOptions} value={sort.direction} onChange={(direction) => {
                                        setSortParameter(idx, "direction", direction)
                                    }} filterOptions={handleFilterWithoutGroup} search /></div>
                                    <div className={styles.action_sort} style={{marginRight: "10px"}} onClick={() => {
                                        let copy = {...valuesUi}
                                        copy.sorts.splice(idx)
                                        console.log(copy.sorts)
                                        setValuesUi(copy)
                                    }}>x</div>
                                </div>
                            </SortableItem>
                        }))
                    }
                </SortableList>
            
        </div>
        <div className={styles.buttons_controller}>
            <button className={styles.button} onClick={createNewSort}>➕ Add Sort by</button>
        </div>
    </>
}