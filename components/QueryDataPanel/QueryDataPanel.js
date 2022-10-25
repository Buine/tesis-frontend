import { useState } from "react"
import useQueryBuilderContext from "../../contexts/QueryBuilderContext"
import uuidv4 from "../../utils/uuidGenerator"
import Popout from "../Popout/Popout"
import QueryImport, { GenerateColumns } from "../QueryImport/QueryImport"
import styles from "./QueryDataPanel.module.css"

export default function QueryDataPanel() {
    const { valuesUi, setValuesUi, queryBuilderData, dataUi } = useQueryBuilderContext()
    const [popoutOpen, setPopoutOpen] = useState(false)

    const createImport = (type = "TABLE") => {
        let copy = {...valuesUi}
        copy.tables.push({
            type,
            value: null,
            alias: "",
            id: uuidv4()
        })

        setValuesUi(copy)
    }

    const createJoinImport = (tableImport) => {
        let copy = {...valuesUi}
        let id = uuidv4()
        copy.tables.push({
            type: "TABLE",
            value: tableImport.leftTable,
            alias: "",
            id,
            join: [
                {value: `${tableImport.leftJoin}.${id}`},
                {value: `${tableImport.rigthJoin}.${tableImport.rigthId}`}
            ]
        })
        GenerateColumns(tableImport.leftTable, copy.tables.length-1, copy, queryBuilderData)

        setValuesUi(copy)
    }

    const dictionaryWithJoinsAndReverseJoin = () => {
        let dictonary = {}
        let [_, ...tables] = valuesUi.tables
        tables.forEach(table => {
            if (table.join && table.join.length > 0 && table.join[0].value && table.join[1].value) {
                console.log(table.join)
                let rigthJoin = table.join[1].value.split(".", 3).join(".")
                let leftJoin = table.join[0].value.split(".", 3).join(".") 
                let join = `${table.join[0].value}.${rigthJoin}`
                let reverseJoin = `${table.join[1].value}.${leftJoin}`
                dictonary[join] = `${table.join[0].value}.${table.join[1].value}`
                dictonary[reverseJoin] = `${table.join[1].value}.${table.join[0].value}`
            }
        })

        return dictonary
    }

    const getRelationshipTablesImported = () => {
        if (!queryBuilderData.schema) { return [] } 
        let schemas = queryBuilderData.schema.schemas
        if (schemas && valuesUi.tables && valuesUi.tables.length > 0) {
            let tables = valuesUi.tables
            let possibleJoins = []
            let alreadyJoins = dictionaryWithJoinsAndReverseJoin()
            console.log(`Already joins`)
            console.log(alreadyJoins)
            tables.forEach(table => {
                if (table.value) {
                let [schemaIdx, tableIdx] =  table.value.split(".")
                    if (schemaIdx && tableIdx) {
                        let relationships = schemas[schemaIdx].tables[tableIdx].foreign_key
                        if (relationships) {
                            let regex = new RegExp(`^${table.value}.+$`)
                            relationships.forEach(relation => {
                                let join = dataUi.idxSchemaByTableNameWithSchema[`${relation.table_schema}.${relation.table_name}.${relation.column_name}`]
                                let foreignJoin = dataUi.idxSchemaByTableNameWithSchema[`${relation.foreign_table_schema}.${relation.foreign_table_name}.${relation.foreign_column_name}`]

                                if (!Object.keys(alreadyJoins).includes(`${join}.${table.id}.${foreignJoin}`) && !Object.keys(alreadyJoins).includes(`${foreignJoin}.${table.id}.${join}`)) {
                                    let isJoin = regex.test(join)
                                    if (join && foreignJoin){
                                        possibleJoins.push({
                                            rigthId: table.id,
                                            leftTable: !isJoin ? join.replace(new RegExp("\.[0-9]+$"), "") : foreignJoin.replace(new RegExp("\.[0-9]+$"), ""),
                                            nameLeft: !isJoin ? `${relation.foreign_table_schema}.${relation.foreign_table_name}.${relation.foreign_column_name}` : `${relation.table_schema}.${relation.table_name}.${relation.column_name}`,
                                            nameRigth: isJoin ? `${relation.foreign_table_schema}.${relation.foreign_table_name}.${relation.foreign_column_name}` : `${relation.table_schema}.${relation.table_name}.${relation.column_name}`,
                                            leftJoin: !isJoin ? join : foreignJoin,
                                            rigthJoin: isJoin ? join : foreignJoin,
                                            rigthAlias: table.alias,
                                            relation
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            })
            console.log(possibleJoins)
            return possibleJoins
        }
    }

    return <div className={styles.container}>
        <div className={styles.header_data}>
            <p>Data in use</p>
            <div className={styles.add_data_button} onClick={() =>{ 
                setPopoutOpen(!popoutOpen)
                
            }}></div>
            <Popout open={popoutOpen} setOpen={setPopoutOpen}>
                <div style={{padding: "1em", background: "white"}}>
                    <div className="list-relationships-tables">
                        Lista de tablas que se pueden relacionar con las tablas que ya estan importadas.
                        <div style={{display: "grid"}}>
                        {getRelationshipTablesImported().map((joins, idx) => {
                            return <button key={idx} onClick={() => { 
                                createJoinImport(joins)
                                setPopoutOpen(false) 
                            }}>{`${joins.nameLeft} (${joins.rigthAlias}) -> ${joins.nameRigth}`}</button>
                        })}
                        </div>
                    </div>
                    <div className="list-relationships-tables">
                        Lista de queries que usan esta integración.
                    </div>
                    <button onClick={() => { createImport("QUERY"); setPopoutOpen(false) }}>Add a query import manually</button>
                    <button onClick={() => { createImport(); setPopoutOpen(false) }}>Add a table import manually</button>
                </div>
            </Popout>
        </div>
        <div className={styles.list_data}>
            <div className={styles.list_data_child}>
                {
                    valuesUi.tables.map((tableImport, idx) => {
                        return <QueryImport key={idx} idxImport={idx} type={tableImport.type}/>    
                     })
                    }
            </div>
        </div>
    </div>
}