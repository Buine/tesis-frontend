import { useRouter } from "next/router"
import { useEffect } from "react"
import ChartSection from "../components/ChartSection/ChartSection"
import QueryBuilder from "../components/QueryBuilder/QueryBuilder"
import QueryBuilderTabs, { TabPanel } from "../components/QueryBuilderTabs/QueryBuilderTabs"
import useQueryBuilderContext from "../contexts/QueryBuilderContext"
import integrationService from "../services/integrations"
import queryService from "../services/queries"
import styles from "../styles/QueryBuilderV2.module.css"

export default function QueryBuilderV2() {
    const router = useRouter()
    const { integration, query } = router.query
    const { 
        queryBuilderData,
        setQueryBuilderData,
        setQueryResult,
        setValuesUi,
        dataUi, 
        setDataUi } = useQueryBuilderContext()
    
    useEffect(() => {
        if (integration && queryBuilderData.schema == undefined && !query) {
            integrationService.getSchemaByCode(integration).then(response => {
                if (!response.err) {
                    let copy = {
                        ...queryBuilderData
                    }
                    copy.schema = response.res
                    copy.queryRequest.integration_code = integration
                    setQueryBuilderData(copy)
                    setDataInit(copy.schema.schemas, dataUi, setDataUi)
                } else {
                    alert(JSON.stringify(response.err))
                    console.error(response.err)
                }
            })
        }

        if (integration && queryBuilderData.queries == undefined && !query) {
            integrationService.getAllQueriesByIntegration(integration).then(response => {
                if (!response.err) {
                    let copy = {
                        ...queryBuilderData
                    }
                    copy.queries = response.res
                    setQueryBuilderData(copy)
                    generateListQueries(copy.queries, dataUi, setDataUi)
                } else {
                    alert(JSON.stringify(response.err))
                    console.error(response.err)
                }
            })
        }

        if (integration && query) {
            if (queryBuilderData.queryCode == query) {
                return
            }
            queryService.getQuery(integration, query).then(response => {
                if (!response.err) {
                    let json = response.res.json
                    if (json) {
                        if (json.queryBuilderData) 
                            setQueryBuilderData({...json.queryBuilderData, queryCode: query})
                        if (json.queryResult)
                            setQueryResult(json.queryResult)
                        if (json.valuesUi) {
                            dateFormatValuesUi(json.valuesUi)
                            setValuesUi(json.valuesUi)
                        }
                        if (json.dataUi)
                            setDataUi(json.dataUi)
                    }
                } else {
                    alert(JSON.stringify(response.err))
                    console.error(response.err)
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integration, dataUi])

    return (
        <main className={styles.main}>
            <QueryBuilderTabs tabs={["Query", "Chart"]}>
                <TabPanel>
                    <QueryBuilder />
                </TabPanel>
                <TabPanel>
                    <ChartSection />
                </TabPanel>
            </QueryBuilderTabs>
        </main>
    )
}

const dateFormatValuesUi = (valuesUi) => {
    if (valuesUi.filters) {
        valuesUi.filters.forEach((filter) => {
             if (filter.sub_condition && filter.sub_condition.includes("DATEPICKER")) {
                if (filter.input_value) {
                    filter.input_value = new Date(filter.input_value)
                }
             }
        }) 
    }
}

const setDataInit = (schemas, dataUi, setDataUi) => {
    let listNativeTables = [{name: "Select a table..", value: null}]
    let idxSchemaByTableNameWithSchema = {}
    if (schemas) {
        let idxTable = 0
        schemas.forEach((schema, idxSchema) => {
            let listNativeSchemaTables = []
            if (schema) {
                schema.tables.forEach(table => {
                    if (table.columns) {
                        table.columns.forEach((column, idxColumn) => {
                            idxSchemaByTableNameWithSchema[`${schema.name}.${table.name}.${column.name}`] = `${idxSchema}.${idxTable}.${idxColumn}`
                        })
                    }
                    listNativeSchemaTables.push(
                        {
                            name: table.name,
                            value: `${idxSchema}.${idxTable}`
                        }
                    )
                    idxTable++
                })
            }
            listNativeTables.push({
                type: "group",
                name: schema.name,
                items: listNativeSchemaTables
            })
        })
    }

    let copy = { ...dataUi }
    copy.listNativeTables = listNativeTables
    copy.idxSchemaByTableNameWithSchema = idxSchemaByTableNameWithSchema
    console.log(listNativeTables)
    console.log(idxSchemaByTableNameWithSchema)
    setDataUi(copy)
}

const generateListQueries = (queries, dataUi, setDataUi) => {
    let listQueries = [{name: "Select a query..", value: null}]
    queries.forEach(query => {
        listQueries.push({
            value: query.code,
            name: query.name,
            sql: query.sql
        })
    })

    let copy = { ...dataUi }
    copy.listQueries = listQueries
    setDataUi(copy)
}
