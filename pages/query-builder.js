import ContainerDropdown from "../components/ContainerDropdown/ContainerDropdown";
import styles from "../styles/QueryBuilder.module.css"
import dynamic from "next/dynamic";
import useQueryBuilderContext from "../contexts/QueryBuilderContext";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import integrationService from "../services/integrations";
import queryService from "../services/queries";
import Filter from "../components/Filter/Filter";

export default function QueryBuilder() {
    const router = useRouter()
    const { integration } = router.query
    const { queryBuilderData, setQueryBuilderData, setQueryResult, queryResult } = useQueryBuilderContext()
    
    useEffect(() => {
        if (integration) {
            integrationService.getSchemaByCode(integration).then(response => {
                if (!response.err) {
                    setQueryBuilderData({
                        ...queryBuilderData,
                        schema: response.res,
                        queryRequest: {
                            ...queryBuilderData.queryRequest,
                            integration_code: integration
                        }
                    })
                } else {
                    alert(JSON.stringify(response.err))
                    console.error(response.err)
                }
            })
        }
    }, [integration])

    const DynamicComponentWithNoSSR = useMemo(() => dynamic(
        () => import("../components/HotTable/HotTable"),
        {
            // TODO: Modify this with a class in module.css
            loading: () => {
                console.log("loading")
                return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}><p>loading...</p></div>
            },
            ssr: false
        }
      ), [queryResult]);
    

    return (
        <main className={styles.main}>
            <div className={styles.main_container}>
                <div className={styles.tools_container}>
                    <div className={styles.tools_container_child}>
                        <ContainerDropdown text="Tables">
                            <div className={styles.tables_container}>
                                <label>From</label>
                                <select name="table_initial" id="table_intial" onChange={(e) => setMainTable(e, queryBuilderData, setQueryBuilderData, setQueryResult)}>
                                    {getListTables(queryBuilderData)}
                                </select>
                                <button 
                                    className={styles.add_filter}
                                    style={{color: 'black'}} 
                                    onClick={() => executeQuery(queryBuilderData, setQueryResult)}
                                >Run Query</button>
                            </div>
                        </ContainerDropdown>
                        <ContainerDropdown text="Filters">
                            <div className={styles.filters_container}>
                                {getFilters(queryBuilderData)}
                                <div className={styles.add_filter} onClick={() => addFilter(queryBuilderData, setQueryBuilderData)}>
                                    <p>Add filter</p>
                                </div>
                            </div>
                        </ContainerDropdown>
                        <ContainerDropdown text="Columns">
                            
                        </ContainerDropdown>
                    </div>
                </div>
                <div className={styles.data_container}>
                    <DynamicComponentWithNoSSR />
                </div>
            </div>
        </main>
    )
}

function getListTables(queryBuilderData) {
    let response = [
        (<option key="default" value="default">Select a table for start</option>)
    ]
    if (queryBuilderData.schema) {
        response = [
            response, 
            ...queryBuilderData.schema.schemas.map((schema, idx_schema) => {
                return schema.tables.map((table, idx_table) => {
                    return (
                        <option key={`${idx_schema}.${idx_table}`} value={`${idx_schema}.${idx_table}`}>{`${schema.name}.${table.name}`}</option>
                    )
                })
            })
        ] 
    }

    return response
}

function setMainTable(e, queryBuilderData, setQueryBuilderData, setQueryResult) {
    if (e.target.value != "default") {
        let [schema, table] = e.target.value.split(".")
        let changes = {...queryBuilderData}
        changes.queryRequest.query_json.tables.schema_name = queryBuilderData.schema.schemas[schema].name
        changes.queryRequest.query_json.tables.table_name = queryBuilderData.schema.schemas[schema].tables[table].name
        changes.tablesInSchema = [{schema, table}]
        setQueryBuilderData(changes)
    } else {
        setQueryResult([])
    }
}

function getFilters(queryBuilderData) {
    let listFiltersRendered = []
    let listOfFilters = queryBuilderData.queryRequest.query_json.filters
    if (Array.isArray(listOfFilters)) {
        listFiltersRendered = listOfFilters.map((_, idx) => {
            console.log(`key ${idx}`)
            return (
                <Filter key={idx} id={idx} />
            )
        })
    }

    return listFiltersRendered
}

function addFilter(queryBuilderData, setQueryBuilderData) {
    let change = {...queryBuilderData}
    let currentFilters = change.queryRequest.query_json.filters
    if (Array.isArray(currentFilters)) {
        currentFilters.push({
            type: "DEFAULT",
            params: [{type: "COLUMN", table_column:{query_column: false}}, {type: "COLUMN", table_column:{query_column: false}}],
            gate_logic_previous: currentFilters.length == 0 ? null : "AND"
        })

        setQueryBuilderData(change)
    }
}

function executeQuery(queryBuilderData, setQueryResult) {
    queryService.runQuery(queryBuilderData.queryRequest).then((response) => {
        if(!response.err) {
            setQueryResult(response.res.data)
        } else {
            alert(JSON.stringify(response.err))
            console.error(response.err)
        }
    })
}