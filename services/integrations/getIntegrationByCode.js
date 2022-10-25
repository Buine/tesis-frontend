import Services from "../../utils/restCatalog";

const GetIntegrationByCode = async (code) => {
    const response = await fetch(Services.Integrations.getIntegrationByCode(code), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default GetIntegrationByCode