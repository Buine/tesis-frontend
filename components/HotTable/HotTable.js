import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import useQueryBuilderContext from '../../contexts/QueryBuilderContext';
import { createRef, useCallback, useEffect, useState } from 'react';

registerAllModules()

export default function HotComponent() {

  const { queryResult } = useQueryBuilderContext()
  const [columns, setColumns] = useState([])

  useEffect(() => {
    setColumns(getColumns())
  }, [setColumns, getColumns])

  const getColumns = useCallback(() => {
    let columns = []
    if (queryResult && queryResult.length > 0) {
      columns = Object.keys(queryResult ? queryResult[0] : {}).map(key => {
        return {data: key, title: key}
      })
    }

    return columns
  }, [queryResult])

  return (
        <HotTable
          data={queryResult ? queryResult : []}
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