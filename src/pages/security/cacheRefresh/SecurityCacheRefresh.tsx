import {
  Button,
  Container,
  Icon,
  Loading,
  PageHeader,
  Table,
  TableModelProps,
} from 'doif-react-kit';
import { useCallback, useMemo, useState } from 'react';
import useAsyncAction, { postAction } from '../../../hooks/useAsyncAction';
import usePage from '../../../hooks/usePage';

/**
 * 캐시 초기화 페이지
 * @returns SecurityCacheRefresh
 */
function SecurityCacheRefresh() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/security/cache/refresh');

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  // 모든 캐시 초기화
  const [refreshAllCache] = useAsyncAction(() =>
    postAction('/api/cache/refresh/all'),
  );

  const [test, setTest] = useState({ hi: 'zzz', hello: '123' });
  const model: TableModelProps[] = useMemo(
    () => [
      {
        label: 'Row 선택 시',
        name: 'selectRow',
        width: 500,
        align: 'left',
      },
      {
        label: '호호호',
        name: 'hohoho',
        width: 500,
        align: 'left',
      },
    ],
    [],
  );

  const data = useMemo(
    () => [
      {
        selectRow: 'Row 선택 시 onSelectRow 함수를 실행합니다.',
        hohoho: '호호호호호',
      },
      {
        selectRow: 'Row 선택 시 onSelectRow 함수를 실행합니다.',
        hohoho: '호호호호호',
      },
    ],
    [],
  );

  const onSelectRow = useCallback((id: string, rowValue: Object) => {
    // alert(
    //   'rowId: ' + id + '\r\n' + 'rowValue: \r\n' + JSON.stringify(rowValue),
    // );
    setTest((state) => ({ ...state, hello: state.hello + '1' }));
  }, []);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  // user role 할당 버튼
  const refreshAllCacheButton =
    pageData.buttonMap['BTN_SECURITY_CACHE_REFRESH_ALL'];

  return (
    <>
      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
      <Container>
        {refreshAllCacheButton && (
          <Button onClick={refreshAllCache}>
            <Icon icon={refreshAllCacheButton.icon} />
            {refreshAllCacheButton.name}
          </Button>
        )}
      </Container>

      {test.hello}
      <Table
        caption="Row 선택 시"
        model={model}
        data={data}
        onSelectRow={onSelectRow}
      />
    </>
  );
}

export default SecurityCacheRefresh;
