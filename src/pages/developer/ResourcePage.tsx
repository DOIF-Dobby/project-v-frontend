import { Table, TableModelProps } from 'doif-react-kit';
import React, { useMemo } from 'react';

function ResourcePage() {
  const model: TableModelProps[] = useMemo(
    () => [
      {
        label: 'Col 1',
        name: 'col1',
        width: 500,
        align: 'left',
      },
      {
        label: 'Col 2',
        name: 'col2',
        width: 500,
        align: 'left',
      },
      {
        label: 'Col 3',
        name: 'col3',
        width: 500,
        align: 'left',
      },
    ],
    [],
  );

  const data = useMemo(
    () => [
      {
        col1: 'data에 subRows 속성으로 데이터를 담고',
        col2:
          'enableTreeTable 속성을 ture로 주면 tree 형식 table을 사용할 수 있습니다.',
        col3: '호호호호',
        subRows: [
          {
            col1: 'data에 subRows 속성으로 데이터를 담고',
            col2:
              'enableTreeTable 속성을 ture로 주면 tree 형식 table을 사용할 수 있습니다.',
            col3: '호호호호',
            subRows: [
              {
                col1: 'data에 subRows 속성으로 데이터를 담고',
                col2:
                  'enableTreeTable 속성을 ture로 주면 tree 형식 table을 사용할 수 있습니다.',
                col3: '호호호호',
              },
            ],
          },
        ],
      },
      {
        col1: 'data에 subRows 속성으로 데이터를 담고',
        col2:
          'enableTreeTable 속성을 ture로 주면 tree 형식 table을 사용할 수 있습니다.',
        col3: '호호호호',
        subRows: [
          {
            col1: 'data에 subRows 속성으로 데이터를 담고',
            col2:
              'enableTreeTable 속성을 ture로 주면 tree 형식 table을 사용할 수 있습니다.',
            col3: '호호호호',
          },
        ],
      },
    ],
    [],
  );

  return (
    <Table caption="Row 선택 시" model={model} data={data} enableTreeTable />
  );
}

export default ResourcePage;
