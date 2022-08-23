import validateRequest from "../../utils/validateRequest"
import getAllQueriesByIntegrationCode from "./getAllQueriesByIntegrationCode"
import RunQuery from "./runQuery"

const queryService = {
    getAllQueries,
    runQuery
}

async function getAllQueries(integrationCode) {
    var response = await getAllQueriesByIntegrationCode(integrationCode)
    return await validateRequest(response)
}

async function runQuery(requestBody) {
    var response = await RunQuery(requestBody)
    return await validateRequest(response)
}

export default queryService
