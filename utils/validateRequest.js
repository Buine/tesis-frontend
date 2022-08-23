const validateRequest = async (response, callback) => {
    let data = await response.json()
    if (response.status >= 400) {
        return {res: null, err: data}
    } else {
        if (callback !== undefined) {
            callback(data)
        }
    }
    return {res: data, err: null}
}

export default validateRequest