const PUBLIC_API_URL = "http://localhost:8080/public-api"

const Services = {
    Users: {
        logInRoute: `${PUBLIC_API_URL}/v1/user/login`,
        signUpRoute: `${PUBLIC_API_URL}/v1/user`
    },
    Integrations: {
        createIntegration: `${PUBLIC_API_URL}/v1/integration`,
        getAllIntegrations: `${PUBLIC_API_URL}/v1/integration`,
        getIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`,
        updateIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`,
        deleteIntegrationByCode: (code) => `${PUBLIC_API_URL}/v1/integration/${code}`
    }
}

export default Services