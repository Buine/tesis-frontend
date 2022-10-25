const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

const Services = {
    Users: {
        logInRoute: `${PUBLIC_API_URL}/v1/user/login`,
        signUpRoute: `${PUBLIC_API_URL}/v1/user`
    },
    Integrations: {
        createIntegration: `${PUBLIC_API_URL}/v1/integration`,
        getAllIntegrations: `${PUBLIC_API_URL}/v1/integration`,
        getIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`,
        getAllQueriesByIntegration: (code) => `${PUBLIC_API_URL}/v1/integration/${code}/queries`,
        updateIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`,
        deleteIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`,
        getSchema: (code) => `${PUBLIC_API_URL}/v1/integration/${code}/schema`,
        getSchemaByQuery: (code, query, json = false) => `${PUBLIC_API_URL}/v1/integration/${code}/query/${query}?with_json=${json}`
    },
    Queries: {
        getAllByIntegratonCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}/queries`,
        runQuery: `${PUBLIC_API_URL}/v1/query/run`,
        saveQuery: `${PUBLIC_API_URL}/v1/query`
    }
}

export default Services