import {
  CloseButton,
  Container,
  DeleteDialog,
  Form,
  Icon,
  iconTypes,
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
import React, { FormEvent, useCallback, useState } from 'react';
import { defaultValue } from '../../../common/commonValue';
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
let buttonRow: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

/**
 * 라벨 자원 관리 페이지
 * @returns ResourceLabel
 */
function ResourceButton() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/button');
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
    httpMethod: '',
    icon: '',
  });

  const { code, name, description, status, url, httpMethod, icon } = form;

  // 라벨들
  const {
    LABEL_RESOURCE_BUTTON_CODE,
    LABEL_RESOURCE_BUTTON_NAME,
    LABEL_RESOURCE_BUTTON_DESCRIPTION,
    LABEL_RESOURCE_BUTTON_STATUS,
    LABEL_RESOURCE_BUTTON_URL,
    LABEL_RESOURCE_BUTTON_HTTP_METHOD,
    LABEL_RESOURCE_BUTTON_ICON,
    LABEL_RESOURCE_BUTTON_CAPTION,
    LABEL_RESOURCE_BUTTON_LIST,
    LABEL_RESOURCE_BUTTON_PAGE_LIST,
  } = useLabels(pageData);

  // 페이지 테이블 model
  const pageTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_BUTTON_PAGE_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_PAGE_NAME',
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

  // icon 데이터들
  const iconCodes = iconTypes.map((icon) => ({
    code: icon,
    name: icon,
    render: (
      <Container>
        <Icon icon={icon} />
        <div>{icon}</div>
      </Container>
    ),
  }));

  // 라벨 테이블 model
  const labelTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_BUTTON_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_NAME',
        name: 'name',
        width: 150,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_DESCRIPTION',
        name: 'description',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_STATUS',
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
        label: 'LABEL_RESOURCE_BUTTON_URL',
        name: 'url',
        width: 200,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_HTTP_METHOD',
        name: 'httpMethod',
        width: 100,
      },
      {
        label: 'LABEL_RESOURCE_BUTTON_ICON',
        name: 'icon',
        width: 100,
        formatter: (cellValue: any) => {
          return cellValue.props.value &&
            iconTypes.includes(cellValue.props.value) ? (
            <Icon icon={cellValue.props.value} />
          ) : (
            cellValue
          );
        },
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

  // 페이지 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
      disablePutDeleteButton: true,
    }));
    getButtons();
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

  // 버튼 데이터 조회
  const [buttons, getButtons]: any = useAsyncGetAction(
    () =>
      pageData &&
      getAction(`/api/resources/pages/${pageRow.resourceId}/buttons`),
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

  // 버튼 등록
  const [postButton, postButtonValid] = useAsyncAction(
    () =>
      postAction('/api/resources/buttons', {
        ...form,
        pageId: pageRow.resourceId,
      }),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 버튼 수정
  const [putButton, putButtonValid] = useAsyncAction(
    () => putAction('/api/resources/buttons/' + buttonRow.resourceId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 버튼 삭제
  const [deleteButton] = useAsyncAction(
    () => deleteAction('/api/resources/buttons/' + buttonRow.resourceId),
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
      id: 'BTN_RESOURCE_BUTTON_ADD',
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
      id: 'BTN_RESOURCE_BUTTON_MODIFY',
      disable: pageState.disablePutDeleteButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: true,
          openModal: true,
        }));
        buttonType = 'put';

        replaceForm({
          name: buttonRow.name,
          description: buttonRow.description,
          status: buttonRow.status,
          code: buttonRow.code,
          url: buttonRow.url,
          httpMethod: buttonRow.httpMethod,
          icon: buttonRow.icon,
          pageId: buttonRow.pageId,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_BUTTON_DELETE',
      disable: pageState.disablePutDeleteButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
  ];
  const tableButtons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // 페이지 자원 목록 테이블 select 시 콜백
  const onSelectPageTableRow = useCallback(
    (id: string, rowValue: any) => {
      pageRow = rowValue;
      setPageState((state) => ({
        ...state,
        disablePostButton: false,
      }));

      getButtons();
    },
    [getButtons],
  );

  // 버튼 자원 목록 테이블 select 시 콜백
  const onSelectButtonTableRow = useCallback((id: string, rowValue: any) => {
    buttonRow = rowValue;
    setPageState((state) => ({
      ...state,
      disablePutDeleteButton: false,
    }));
  }, []);

  // 버튼 저장
  const onSaveButton = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postButton();
    } else if (buttonType === 'put') {
      putButton();
    }
  };

  // Validation
  const buttonValid = mergeValid([postButtonValid, putButtonValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteButton}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />

      <Container>
        <div style={{ width: '35%' }}>
          <Table
            caption={LABEL_RESOURCE_BUTTON_PAGE_LIST}
            model={pageTableModel}
            data={pages ? pages.content : []}
            onSelectRow={onSelectPageTableRow}
          />
        </div>
        <div style={{ width: '65%' }}>
          <Table
            caption={LABEL_RESOURCE_BUTTON_LIST}
            buttons={tableButtons}
            model={labelTableModel}
            data={buttons ? buttons.content : []}
            onSelectRow={onSelectButtonTableRow}
          />
        </div>
      </Container>

      <Modal
        visible={pageState.openModal}
        title={LABEL_RESOURCE_BUTTON_CAPTION}
      >
        <Form onSubmit={onSaveButton}>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_BUTTON_CODE}
              value={code}
              onChange={onChangeForm}
              name="code"
              disabled={pageState.disableItem}
              validation={buttonValid.code}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_BUTTON_NAME}
              value={name}
              onChange={onChangeForm}
              name="name"
              validation={buttonValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_RESOURCE_BUTTON_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_BUTTON_HTTP_METHOD}
              value={httpMethod}
              onChange={onChangeForm}
              defaultValue={defaultValue}
              data={[
                { code: 'GET', name: 'GET' },
                { code: 'POST', name: 'POST' },
                { code: 'PUT', name: 'PUT' },
                { code: 'DELETE', name: 'DELETE' },
              ]}
              name="httpMethod"
              validation={buttonValid.httpMethod}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_BUTTON_URL}
              value={url}
              onChange={onChangeForm}
              name="url"
              placeholder="'/api'로 시작해야 합니다."
              validation={buttonValid.url}
            />
          </Row>
          <Row>
            <LabelSelect
              label={LABEL_RESOURCE_BUTTON_ICON}
              data={iconCodes}
              defaultValue={defaultValue}
              value={icon}
              onChange={onChangeForm}
              name="icon"
              validation={buttonValid.icon}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_BUTTON_STATUS}
              data={enableCodes}
              defaultValue={defaultValue}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={buttonValid.status}
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

export default ResourceButton;
