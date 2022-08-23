import { createContext, useContext, useMemo, useState } from "react";

export const QueryBuilderContext = createContext(null)

export const QueryBuilderProvider = ({children}) => {
    const [queryBuilderData, setQueryBuilderData] = useState({
        queryRequest: {
            query_name: "Untitled",
            integration_code: null,
            query_json: {
                columns: [],
                filters: [],
                tables: {
                    schema_name: null,
                    table_name: null,
                    alias: null
                },
                group_by: [],
                order: []
            }
        },
        tablesInSchema:[]
    })
    const [queryResult, setQueryResult] = useState([])

    const values = useMemo(() => ({
        queryBuilderData,
        setQueryBuilderData,
        queryResult,
        setQueryResult
    }), [queryBuilderData, queryResult])

    return (
        <QueryBuilderContext.Provider value={values}>
            {children}
        </QueryBuilderContext.Provider>
    )
}

export function useQueryBuilderContext() {
    const context = useContext(QueryBuilderContext)

    if (!context) {
        console.error('Error deploying Query Builder Context!')
    }

    return context
}

export default useQueryBuilderContext;