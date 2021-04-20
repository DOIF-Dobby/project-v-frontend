import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Loading,
  Table,
  TableModelProps,
} from 'doif-react-kit';
import React, { useCallback, useMemo, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import usePage from '../../hooks/usePage';

async function getMenus(url: string) {
  const response = await axios.get(url);
  return response.data;
}

function ResourceMenu() {
  const [isLoading, pageData] = usePage('/api/pages/resources/menu');
  const [tableData, setTableData] = useState([]);

  const [menuState, refetch] = useAsync(
    () => getMenus(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url),
    [pageData],
  );

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
        width: 150,
        align: 'left',
      },
    ],
    [],
  );

  const onFetchMenuData = useCallback(() => {
    axios
      .get(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url)
      .then((response) => console.log(response));
  }, [pageData]);

  return (
    <>
      {isLoading && <Loading />}
      <Box>
        <Container direction="column">
          <Container align="right">
            <Button onClick={onFetchMenuData}>조회</Button>
          </Container>

          <Table
            caption="메뉴 자원 목록"
            model={model}
            data={tableData}
            loading={menuState.loading}
          />
        </Container>
      </Box>
    </>
  );
}

export default ResourceMenu;
