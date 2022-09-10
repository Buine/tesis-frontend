import Services from "../../utils/restCatalog";

const CreateIntegration = async (requestBody) => {
    const response = await fetch(Services.Integrations.createIntegration, {
        method: 'POST',
        credentials: 'omit',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response
}

export default CreateIntegration