import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title, RadialLinearScale, PointElement, LineElement
} from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import SelectSearch from 'react-select-search';
import useQueryBuilderContext from '../../contexts/QueryBuilderContext';
import { handleFilterWithoutGroup, handleFilter } from '../../utils/HandleFilterSelect';
import styles from "./ChartSection.module.css"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title, RadialLinearScale, PointElement, LineElement);

const defaultData = {
    labels: [],
    datasets: [
        {
            label: '# of Votes',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                'rgba(0, 0, 0, 1)',
            ],
            borderWidth: 2,
        },
    ],
};

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true
        }
    },
};

const listTypeCharts = [
    {
        name: "Select a type chart...",
        value: ""
    },
    {
        name: "Pie Chart",
        value: "PIE"
    },
    {
        name: "Bar Chart",
        value: "BAR"
    },
    {
        name: "Radar Chart",
        value: "RADAR"
    },
    {
        name: "Line Chart",
        value: "LINE"
    }
]

export default function ChartSection() {
    let { queryResult, queryBuilderData, setQueryBuilderData, valuesUi } = useQueryBuilderContext()
    let currentColumns = valuesUi.alternativeColumns.length == 0 ? valuesUi.columns : valuesUi.alternativeColumns
    let columnsOptions = [{ name: "Select a column...", value: "" }, ...currentColumns.map(column => { return { name: column.alternativeName ? column.alternativeName : column.name, value: column.id_ext ? column.id_ext : column.value, data_type: column.data_type } })]

    const [chartData, setChartData] = useState(defaultData)

    useEffect(() => {
        setChartData(getColumns())
    }, [queryBuilderData, setChartData, getColumns])

    const getColumns = useCallback(() => {
        let copy = { ...chartData }
        let properties = queryBuilderData.chartConfig.properties
        let currentColumns = valuesUi.alternativeColumns.length == 0 ? valuesUi.columns : valuesUi.alternativeColumns

        let nameColumnLabel = currentColumns.filter(c => { return c.value == properties.labelInput || c.id_ext == properties.labelInput })
        nameColumnLabel = nameColumnLabel[0] ? nameColumnLabel[0].name : null
        console.log("label", nameColumnLabel)
        copy.labels = nameColumnLabel ? queryResult.response.map(c => { return c[nameColumnLabel] }) : []

        let nameColumnValues = currentColumns.filter(c => { return c.value == properties.valueInput || c.id_ext == properties.valueInput })
        nameColumnValues = nameColumnValues[0] ? nameColumnValues[0].alternativeName ? nameColumnValues[0].alternativeName : nameColumnValues[0].name : null // TODO: FIX THAT SHIT WHEN FUNCTIONS ALIAS WORKS
        console.log(nameColumnValues)
        copy.datasets[0].data = nameColumnLabel ? queryResult.response.map(c => { return c[nameColumnValues] }) : []
        console.log(copy.datasets[0].data)

        copy.datasets[0].label = properties.textChart

        return copy
    }, [queryBuilderData, queryResult, chartData, valuesUi])

    return <div className={styles.main}>
        <div className={styles.container}>
            <div className={styles.header_data}>
                <p>Properties</p>
            </div>
            <div className={styles.list_data}>
                <div className={styles.list_data_child}>
                    <div style={{ padding: "15px 10px" }}>
                        <div className={styles.input_div}>
                            <label>Type chart</label>
                            <SelectSearch
                                options={listTypeCharts}
                                filterOptions={handleFilterWithoutGroup}
                                onChange={(value) => {
                                    let copy = { ...queryBuilderData }
                                    copy.chartConfig.type = value
                                    setQueryBuilderData(copy)
                                }}
                                value={queryBuilderData.chartConfig.type}
                                autoFocus={false}
                                search
                            />
                        </div>
                        <div className={styles.input_div}>
                            <label style={{ fontWeight: "400" }}>Chart properties 🔧</label>
                        </div>
                        <div className={styles.input_div}>
                            <label>Label input data</label>
                            <SelectSearch
                                options={columnsOptions}
                                filterOptions={handleFilterWithoutGroup}
                                onChange={(value) => {
                                    let copy = { ...queryBuilderData }
                                    copy.chartConfig.properties.labelInput = value
                                    setQueryBuilderData(copy)
                                }}
                                value={queryBuilderData.chartConfig.properties.labelInput ? queryBuilderData.chartConfig.properties.labelInput : ""}
                                autoFocus={false}
                                search
                            />
                        </div>
                        <div className={styles.input_div}>
                            <label>Values input data</label>
                            <SelectSearch
                                options={columnsOptions}
                                filterOptions={handleFilterWithoutGroup}
                                onChange={(value) => {
                                    let copy = { ...queryBuilderData }
                                    copy.chartConfig.properties.valueInput = value
                                    setQueryBuilderData(copy)
                                    console.log(copy.chartConfig)
                                }}
                                value={queryBuilderData.chartConfig.properties.valueInput ? queryBuilderData.chartConfig.properties.valueInput : ""}
                                autoFocus={false}
                                search
                            />
                        </div>
                        {queryBuilderData.chartConfig.type != "PIE" && <div className={styles.input_div}>
                            <label>Unit label data</label>
                            <input className={styles.input} value={queryBuilderData.chartConfig.properties.textChart} onChange={(evt) => {
                                    let copy = { ...queryBuilderData }
                                    copy.chartConfig.properties.textChart = evt.target.value
                                    setQueryBuilderData(copy)
                                }} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
        <div style={{ padding: "0rem", width: "100%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center" }}>
            <div style={{ width: "calc(100vh - 100px)", height: "calc(100vh - 100px)", padding: "1em" }}>
                {console.log(chartData)}
                {queryBuilderData.chartConfig.type == "PIE" && <Pie options={options} data={chartData} redraw />}
                {queryBuilderData.chartConfig.type == "BAR" && <Bar options={options} data={chartData} redraw />}
                {queryBuilderData.chartConfig.type == "RADAR" && <Radar options={options} data={chartData} redraw />}
                {queryBuilderData.chartConfig.type == "LINE" && <Line options={options} data={chartData} redraw />}
            </div>
        </div>
    </div>
}