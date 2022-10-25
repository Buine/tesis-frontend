import validateRequest from "../../utils/validateRequest"
import CreateIntegration from "./createIntegration"
import GetAllIntegrations from "./getAllIntegrations"
import GetSchemaByCode from "./getSchemaByCode"
import GetIntegrationByCode from "./getIntegrationByCode"
import GetAllQueriesByIntegration from "./getAllQueriesByIntegration"
import GetSchemaByQuery from "./GetSchemaByQuery"

const integrationService = {
    createIntegration,
    getAllIntegrations,
    getSchemaByCode,
    getIntegrationByCode,
    getAllQueriesByIntegration,
    getSchemaByQuery
}

async function createIntegration(requestBody) {
    var response = await CreateIntegration(requestBody)
    return await validateRequest(response)
}

async function getAllIntegrations() {
    var response = await GetAllIntegrations()
    return await validateRequest(response)
}

async function getSchemaByCode(code) {
    var response = await GetSchemaByCode(code)
    return await validateRequest(response)
}

async function getIntegrationByCode(code) {
    var response = await GetIntegrationByCode(code)
    return await validateRequest(response)
}

async function getAllQueriesByIntegration(code) {
    var response = await GetAllQueriesByIntegration(code)
    return await validateRequest(response)
}

async function getSchemaByQuery(code, query, json = false) {
    var response = await GetSchemaByQuery(code, query, json)
    return await validateRequest(response)
}

export default integrationService
