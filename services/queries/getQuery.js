import Services from "../../utils/restCatalog";

const GetQuery = async (integration, query, json = true) => {
    const response = await fetch(Services.Queries.getQuery(integration, query, json), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default GetQuery