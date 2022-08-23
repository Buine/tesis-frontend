import Services from "../../utils/restCatalog";

const getSchemaByCode = async (code) => {
    const response = await fetch(Services.Integrations.getSchema(code), {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default getSchemaByCode