import { SortableItem, SortableList } from "@omakase-ui/react-sortable-list";
import { useState } from "react";
import useQueryBuilderContext from "../../contexts/QueryBuilderContext";
import Slider from "../Slider/Slider";
import styles from "./HideFieldsComponent.module.css"

export default function HideFieldsComponent() {
    const { valuesUi, setValuesUi } = useQueryBuilderContext()
    const [search, setSearch] = useState("")
    let columns = valuesUi.columns

    const setMasiveStatus = (status) => {
        let copy = {...valuesUi}
        copy.columns.forEach(column => {
            column.status = status
        });
        setValuesUi(copy)
    }

    return <>
        <input className={styles.search_input} value={search} onChange={(evt) => setSearch(evt.target.value)}></input>
        {search != "" && <div className={styles.fields_list}>
            {
                columns.filter(column => column.name.toLowerCase().includes(search.toLowerCase())).map((item, idx) => {
                    return <div key={idx} className={styles.field_detail_2}>
                        <Slider status={item.status} setStatus={() => {
                            let copy = {...valuesUi}
                            copy.columns[item.id-1].status = !copy.columns[item.id-1].status
                            setValuesUi(copy)
                            console.log(copy)
                        }}/>
                        <span className={styles.span_field}>{item.name}</span>
                    </div>
                })
            }
        </div>}
        {search == "" && <SortableList items={columns} setItems={(newStatus) => {
            let copy = {...valuesUi}
            copy.columns = newStatus(columns)
            setValuesUi(copy)
        }}>
        {({ items }) => (
        <div className={styles.fields_list}>
            {items.map((item, idx) => (
            <div key={idx} className={styles.field}>
                <SortableItem
                    key={item.id}
                    id={item.id}
                    DragHandler={DragHandler}
                    className={styles.item}
                >
                    <div className={styles.field_detail}>
                        <Slider status={item.status} setStatus={() => {
                            let copy = {...valuesUi}
                            copy.columns[idx].status = !copy.columns[idx].status
                            setValuesUi(copy)
                            console.log(copy)
                        }}/>
                        <span className={styles.span_field}>{item.name}</span>
                    </div>
                </SortableItem>
            </div>
            ))}
        </div>
        )}
    </SortableList>}
    <div className={styles.button_section}>
        <button className={styles.button} onClick={() => setMasiveStatus(false)}>Hide all</button>
        <button className={styles.button} onClick={() => setMasiveStatus(true)}>Show all</button>
    </div>
    </>
}

const DragHandler = (props) => (
    <div {...props} style={{cursor: "pointer"}}>
        ☰
    </div>
);