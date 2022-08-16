import Services from "../../utils/restCatalog";

const getAllIntegrations = async () => {
    const response = await fetch(Services.Integrations.getAllIntegrations, {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default getAllIntegrations