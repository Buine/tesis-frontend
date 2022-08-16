import Services from "../../utils/restCatalog";

const SignUpService = async (requestBody) => {
    const response = await fetch(Services.Users.signUpRoute, {
        method: 'POST',
        credentials: 'omit',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response
}

export default SignUpService