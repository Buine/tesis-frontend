import validateRequest from "../../utils/validateRequest"
import CreateIntegration from "./createIntegration"
import GetAllIntegrations from "./getAllIntegrations"
import GetSchemaByCode from "./getSchemaByCode"
import GetIntegrationByCode from "./getIntegrationByCode"

const integrationService = {
    createIntegration,
    getAllIntegrations,
    getSchemaByCode,
    getIntegrationByCode
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

export default integrationService