import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import useQueryBuilderContext from '../../contexts/QueryBuilderContext';
import { useCallback, useEffect, useState } from 'react';

registerAllModules()

export default function HotComponent() {

  const { queryResult } = useQueryBuilderContext()
  const [columns, setColumns] = useState([])

  useEffect(() => {
    setColumns(getColumns())
  }, [setColumns, getColumns])

  const getColumns = useCallback(() => {
    let columns = []
    if (queryResult && queryResult.response.length > 0) {
      columns = Object.keys(queryResult.response ? queryResult.response[0] : {}).map(key => {
        return {data: key, title: key}
      })
    }
    console.log(queryResult)

    return columns
  }, [queryResult])

  return (
        <HotTable
          // data={[
          //   ["", "Tesla", "Volvo", "Toyota", "Honda"],
          //   ["2020", 10, 11, 12, 13],
          //   ["2021", 20, 11, 14, 13],
          //   ["2022", 30, 15, 12, 13]
          // ]}
          data={queryResult ? queryResult.response : []}
          colHeaders={true}
          rowHeaders={false}
          multiColumnSorting={true}
          manualColumnResize={true}
          beforeColumnSort={(currentSortConfig, destinationSortConfigs) => {
              console.log(currentSortConfig)
              console.log(destinationSortConfigs)
          }}
          columns={columns}
          readOnly={true}
          stretchH='all'
          licenseKey="non-commercial-and-evaluation"
        />
    );
}