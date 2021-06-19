import {
  Loading,
  PageHeader,
  Table,
  TableModelProps,
  useChange,
} from 'doif-react-kit';
import { useCallback, useMemo, useState } from 'react';
import usePage from '../../../hooks/usePage';
import useTableModel from '../../../hooks/useTableModel';

// table row data
let row: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

/**
 * 시스템 속성 관리 페이지
 * @returns SystemProperty
 */

function SystemProperty() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/system/property');

  // 초기 페이지 상태
  const initPageState = {
    openModal: false,
    disableButton: true,
    openDeleteDialog: false,
    disableItem: false,
  };

  // 페이지 상태
  const [pageState, setPageState] = useState(initPageState);

  // form 데이터
  const [form, onChangeForm, replaceForm, resetForm] = useChange({
    propertyGroup: '',
    property: '',
    value: '',
    description: '',
    updatable: 'true',
  });

  const { propertyGroup, property, value, description, updatable } = form;

  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_MESSAGE_CODE',
        name: 'propertyGroup',
        width: 200,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_NAME',
        name: 'property',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_DESCRIPTION',
        name: 'value',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_STATUS',
        name: 'updatable',
        width: 120,
      },
    ],
    pageData,
  );

  const data = useMemo(
    () => [
      {
        propertyGroup: 'Row 선택 시 onSelectRow 함수를 실행합니다.',
        hohoho: '호호호호호',
      },
      {
        propertyGroup: 'Row 선택 시 onSelectRow 함수를 실행합니다.',
        hohoho: '호호호호호',
      },
    ],
    [],
  );

  // const model: TableModelProps[] = useMemo(
  //   () => [
  //     {
  //       label: 'Row 선택 시',
  //       name: 'propertyGroup',
  //       width: 500,
  //       align: 'left',
  //     },
  //     {
  //       label: '호호호',
  //       name: 'hohoho',
  //       width: 500,
  //       align: 'left',
  //     },
  //   ],
  //   [pageData, data],
  // );

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/

  // 테이블 select 시 콜백
  const onSelectRow = useCallback((id: string, rowValue: any) => {
    row = rowValue;
    // setPageState((state) => ({
    //   ...state,
    //   disableButton: false,
    // }));

    setPageState((state) => ({ ...state }));
  }, []);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
      <Table
        caption={'zzz'}
        model={model}
        // buttons={buttons}
        data={data}
        onSelectRow={onSelectRow}
      />
    </>
  );
}

export default SystemProperty;
