import Services from "../../utils/restCatalog";

const SaveQuery = async (requestBody) => {
    const response = await fetch(Services.Queries.saveQuery, {
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

export default SaveQuery