const PUBLIC_API_URL = "http://localhost:8080/public-api"

const Services = {
    Users: {
        logInRoute: `${PUBLIC_API_URL}/v1/user/login`,
        signUpRoute: `${PUBLIC_API_URL}/v1/user`
    }
}

export default Services