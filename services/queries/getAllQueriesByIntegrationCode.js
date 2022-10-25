import Services from "../../utils/restCatalog";

const getQueriesByIntegrationCode = async (code) => {
    const response = await fetch(Services.Queries.getAllByIntegratonCode(code), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default getQueriesByIntegrationCode