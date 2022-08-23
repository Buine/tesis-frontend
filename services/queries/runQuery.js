import Services from "../../utils/restCatalog";

const runQuery = async (requestBody) => {
    const response = await fetch(Services.Queries.runQuery, {
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

export default runQuery