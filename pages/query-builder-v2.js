import { useRouter } from "next/router"
import { useEffect } from "react"
import QueryBuilder from "../components/QueryBuilder/QueryBuilder"
import QueryBuilderTabs, { TabPanel } from "../components/QueryBuilderTabs/QueryBuilderTabs"
import useQueryBuilderContext from "../contexts/QueryBuilderContext"
import integrationService from "../services/integrations"
import styles from "../styles/QueryBuilderV2.module.css"

export default function QueryBuilderV2() {
    const router = useRouter()
    const { integration } = router.query
    const { queryBuilderData, setQueryBuilderData, dataUi, setDataUi  } = useQueryBuilderContext()
    
    useEffect(() => {
        if (integration && queryBuilderData.schema == undefined) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [integration])

    return (
        <main className={styles.main}>
            <QueryBuilderTabs tabs={["Query", "Chart"]}>
                <TabPanel>
                    <QueryBuilder />
                </TabPanel>
                <TabPanel>
                    <div>
                    Aqui estara la seccion para realizar reportes/graficas.
                    </div>
                </TabPanel>
            </QueryBuilderTabs>
        </main>
    )
}

const setDataInit = (schemas, dataUi, setDataUi) => {
    let listNativeTables = [{name: "Select a table..", value: null}]
    if (schemas) {
        let idxTable = 0
        schemas.forEach((schema, idxSchema) => {
            let listNativeSchemaTables = []
            if (schema) {
                schema.tables.forEach(table => {
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
    console.log(listNativeTables)
    setDataUi(copy)
}
