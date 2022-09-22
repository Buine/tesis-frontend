const numericDataTypes = [
    "smallint",
    "integer",
    "bigint",
    "decimal",
    "numeric",
    "double precision",
    "smallserial",
    "serial",
    "bigserial"
]

const dateDataTypes = [
    "time",
    "timestamp",
    "date"
]

export default function MapperTypeDbToPrimitive(typeData) {
    let dataType = "TEXT"
    numericDataTypes.forEach(type => {
        if (typeData.toLowerCase().includes(type.toLowerCase())) {
            dataType = "NUMBER"
        }
    })
    dateDataTypes.forEach(type => {
        if (typeData.toLowerCase().includes(type.toLowerCase())) {
            dataType = "DATE"
        }
    })
    if (typeData.toLowerCase() == "boolean") {
        dataType = "BOOLEAN"
    }

    return dataType
}