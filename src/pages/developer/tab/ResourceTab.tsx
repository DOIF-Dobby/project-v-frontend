import {
  CloseButton,
  Container,
  DeleteDialog,
  Form,
  InFormContainer,
  LabelInput,
  LabelSelect,
  Loading,
  Modal,
  PageHeader,
  Row,
  SaveButton,
  Table,
  TableModelProps,
  useChange,
} from 'doif-react-kit';
import { FormEvent, useCallback, useState } from 'react';
import mergeValid from '../../../common/mergeValid';
import useAsyncAction, {
  deleteAction,
  postAction,
  putAction,
} from '../../../hooks/useAsyncAction';
import useAsyncGetAction, { getAction } from '../../../hooks/useAsyncGetAction';
import useButtons, { ButtonInfoProps } from '../../../hooks/useButtons';
import useCodes from '../../../hooks/useCodes';
import useLabels from '../../../hooks/useLabels';
import usePage from '../../../hooks/usePage';
import useTableModel from '../../../hooks/useTableModel';

// table row data
let pageRow: any = {};
let tabRow: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

/**
 * 라벨 자원 관리 페이지
 * @returns ResourceTab
 */
function ResourceTab() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/tab');
  // 코드 조회
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);

  // 초기 페이지 상태
  const initPageState = {
    openModal: false,
    disablePostButton: true,
    disablePutDeleteButton: true,
    openDeleteDialog: false,
    disableItem: false,
  };

  // 페이지 상태
  const [pageState, setPageState] = useState(initPageState);

  // form 데이터
  const [form, onChangeForm, replaceForm, resetForm] = useChange({
    code: '',
    name: '',
    description: '',
    status: 'ENABLE',
    url: '',
    sort: '',
    tabGroup: '',
  });

  const { code, name, description, status, url, sort, tabGroup } = form;

  // 라벨들
  const {
    LABEL_RESOURCE_TAB_CODE,
    LABEL_RESOURCE_TAB_NAME,
    LABEL_RESOURCE_TAB_DESCRIPTION,
    LABEL_RESOURCE_TAB_STATUS,
    LABEL_RESOURCE_TAB_URL,
    LABEL_RESOURCE_TAB_SORT,
    LABEL_RESOURCE_TAB_GROUP,
    LABEL_RESOURCE_TAB_CAPTION,
    LABEL_RESOURCE_TAB_LIST,
    LABEL_RESOURCE_TAB_PAGE_LIST,
  } = useLabels(pageData);

  // 페이지 테이블 model
  const pageTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_TAB_PAGE_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_TAB_PAGE_NAME',
        name: 'name',
        width: 300,
        align: 'left',
      },
      {
        label: '',
        name: 'resourceId',
        hidden: true,
      },
    ],
    pageData,
  );

  // 탭 테이블 model
  const labelTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_TAB_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_TAB_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_TAB_DESCRIPTION',
        name: 'description',
        width: 300,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_TAB_STATUS',
        name: 'statusName',
        width: 120,
        formatter: (cellValue: any) => {
          return cellValue.props.value === '가능' ? (
            <span style={{ color: '#02c902' }}>{cellValue}</span>
          ) : (
            <span style={{ color: '#fc3d3d' }}>{cellValue}</span>
          );
        },
      },
      {
        label: 'LABEL_RESOURCE_TAB_URL',
        name: 'url',
        width: 200,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_TAB_GROUP',
        name: 'tabGroup',
        width: 120,
      },
      {
        label: 'LABEL_RESOURCE_TAB_SORT',
        name: 'sort',
        width: 80,
      },
      {
        label: '',
        name: 'httpMethod',
        hidden: true,
      },
      {
        label: '',
        name: 'resourceId',
        hidden: true,
      },
    ],
    pageData,
  );

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  // 라벨 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
      disablePutDeleteButton: true,
    }));
    getTabs();
  };

  // 페이지 데이터 조회
  const [pages]: any = useAsyncGetAction(
    () => pageData && getAction('/api/resources/pages'),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 탭 데이터 조회
  const [tabs, getTabs]: any = useAsyncGetAction(
    () =>
      pageData && getAction(`/api/resources/pages/${pageRow.resourceId}/tabs`),
    [pageData],
    {
      skip: true,
      onSuccess: () => {
        setPageState((state) => ({
          ...state,
          disablePostButton: false,
        }));
      },
    },
  );

  // 탭 등록
  const [postTab, postTabValid] = useAsyncAction(
    () =>
      postAction('/api/resources/tabs', {
        ...form,
        pageId: pageRow.resourceId,
        httpMethod: 'GET',
      }),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 탭 수정
  const [putTab, putTabValid] = useAsyncAction(
    () => putAction('/api/resources/tabs/' + tabRow.resourceId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 탭 삭제
  const [deleteTab] = useAsyncAction(
    () => deleteAction('/api/resources/tabs/' + tabRow.resourceId),
    {
      onSuccess: asyncSucCallback,
    },
  );

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/
  // 테이블 버튼들
  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_TAB_ADD',
      disable: pageState.disablePostButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: false,
          openModal: true,
        }));
        buttonType = 'post';

        resetForm();
      },
    },
    {
      id: 'BTN_RESOURCE_TAB_MODIFY',
      disable: pageState.disablePutDeleteButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: true,
          openModal: true,
        }));
        buttonType = 'put';

        replaceForm({
          name: tabRow.name,
          description: tabRow.description,
          status: tabRow.status,
          code: tabRow.code,
          url: tabRow.url,
          tabGroup: tabRow.tabGroup,
          sort: tabRow.sort,
          httpMethod: tabRow.httpMethod,
          pageId: tabRow.pageId,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_TAB_DELETE',
      disable: pageState.disablePutDeleteButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // 페이지 자원 목록 테이블 select 시 콜백
  const onSelectPageTableRow = useCallback(
    (id: string, rowValue: any) => {
      pageRow = rowValue;
      setPageState((state) => ({
        ...state,
        disablePostButton: false,
        disablePutDeleteButton: true,
      }));

      getTabs();
    },
    [getTabs],
  );

  // 탭 자원 목록 테이블 select 시 콜백
  const onSelectTabTableRow = useCallback((id: string, rowValue: any) => {
    tabRow = rowValue;
    setPageState((state) => ({
      ...state,
      disablePutDeleteButton: false,
    }));
  }, []);

  // 탭 저장
  const onSaveTab = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postTab();
    } else if (buttonType === 'put') {
      putTab();
    }
  };

  // 탭 이름 blur 이벤트
  const onBlurName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!description) {
      replaceForm({
        ...form,
        description: name,
      });
    }
  };

  // Validation
  const tabValid = mergeValid([postTabValid, putTabValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteTab}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />

      <Container>
        <div style={{ width: '35%' }}>
          <Table
            caption={LABEL_RESOURCE_TAB_PAGE_LIST}
            model={pageTableModel}
            data={pages ? pages.content : []}
            onSelectRow={onSelectPageTableRow}
          />
        </div>
        <div style={{ width: '65%' }}>
          <Table
            caption={LABEL_RESOURCE_TAB_LIST}
            buttons={buttons}
            model={labelTableModel}
            data={tabs ? tabs.content : []}
            onSelectRow={onSelectTabTableRow}
          />
        </div>
      </Container>

      <Modal visible={pageState.openModal} title={LABEL_RESOURCE_TAB_CAPTION}>
        <Form onSubmit={onSaveTab}>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_TAB_CODE}
              value={code}
              onChange={onChangeForm}
              name="code"
              disabled={pageState.disableItem}
              validation={tabValid.code}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_TAB_NAME}
              value={name}
              onChange={onChangeForm}
              onBlur={onBlurName}
              name="name"
              validation={tabValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_RESOURCE_TAB_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_TAB_STATUS}
              data={enableCodes}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={tabValid.status}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_TAB_GROUP}
              value={tabGroup}
              onChange={onChangeForm}
              name="tabGroup"
              validation={tabValid.tabGroup}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_TAB_URL}
              value={url}
              onChange={onChangeForm}
              name="url"
              validation={tabValid.url}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_TAB_SORT}
              value={sort}
              onChange={onChangeForm}
              name="sort"
              validation={tabValid.sort}
            />
          </Row>
          <InFormContainer>
            <SaveButton />
            <CloseButton
              onClick={() =>
                setPageState((state) => ({ ...state, openModal: false }))
              }
            />
          </InFormContainer>
        </Form>
      </Modal>
    </>
  );
}

export default ResourceTab;
