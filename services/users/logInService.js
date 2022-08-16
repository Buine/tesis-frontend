import Services from "../../utils/restCatalog";

const LogInService = async (requestBody) => {
    const response = await fetch(Services.Users.logInRoute, {
        method: 'POST',
        credentials: 'omit',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response
}

export default LogInService

