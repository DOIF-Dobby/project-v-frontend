import axios from 'axios';
import {
  Button,
  Container,
  Icon,
  Loading,
  Table,
  TableModelProps,
} from 'doif-react-kit';
import React, { useMemo } from 'react';
import useAsync from '../../hooks/useAsync';
import usePage from '../../hooks/usePage';
import useButtons, { ButtonInfoProps } from '../../hooks/useButtons';

async function getMenus(url: string) {
  const response = await axios.get(url);
  return response.data;
}

function ResourceMenu() {
  const [isLoading, pageData] = usePage('/api/pages/resources/menu');
  const [menuState, refetch]: any = useAsync(
    () => pageData && getMenus(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url),
    [pageData],
    true,
  );

  const { data, loading } = menuState;

  const model: TableModelProps[] = useMemo(
    () => [
      {
        label: '',
        name: 'resourceId',
        hidden: true,
      },
      {
        label: '메뉴명',
        name: 'name',
        width: 300,
        align: 'left',
      },
      {
        label: '메뉴 코드',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: '설명',
        name: 'description',
        width: 350,
        align: 'left',
      },
      {
        label: '사용 가능 상태',
        name: 'statusName',
        width: 120,
      },
      {
        label: 'URL',
        name: 'url',
        width: 250,
        align: 'left',
      },
      {
        label: '아이콘',
        name: 'icon',
        width: 120,
        formatter: (cellValue: any) => {
          return cellValue.props.value ? (
            <Icon icon={cellValue.props.value} />
          ) : (
            cellValue
          );
        },
      },
      {
        label: '구분',
        name: 'typeName',
        width: 120,
      },
    ],
    [],
  );

  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_MENU_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        alert('hhihi');
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_MODIFY',
    },
    {
      id: 'BTN_RESOURCE_MENU_DELETE',
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // if (!pageData) {
  //   return null;
  // }

  return (
    <>
      {(isLoading || loading) && <Loading />}
      <Container align="right">
        <Button onClick={refetch}>조회</Button>
      </Container>

      <Table
        caption="메뉴 자원 목록"
        model={model}
        buttons={buttons}
        enableTreeTable
        disableFilters
        data={data ? data.content : []}
      />
    </>
  );
}

export default ResourceMenu;
