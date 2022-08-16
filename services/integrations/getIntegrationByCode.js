import Services from "../../utils/restCatalog";

const getIntegrationByCode = async (code) => {
    const response = await fetch(Services.Integrations.getIntegrationByCode(code), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default getIntegrationByCode