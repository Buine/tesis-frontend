import Services from "../../utils/restCatalog";

const GetAllQueriesByIntegration = async (code) => {
    const response = await fetch(Services.Integrations.getAllQueriesByIntegration(code), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default GetAllQueriesByIntegration