import Services from "../../utils/restCatalog";

const GetSchemaByQuery = async (code, query, json = false) => {
    const response = await fetch(Services.Integrations.getSchemaByQuery(code, query, json), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default GetSchemaByQuery