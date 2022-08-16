import Services from "../../utils/restCatalog";

const createIntegration = async (requestBody) => {
    const response = await fetch(Services.Integrations.createIntegration, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("Authorization")
        }
    })

    return response
}

export default createIntegration