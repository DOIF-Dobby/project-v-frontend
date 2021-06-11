import {
  CloseButton,
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
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
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
let row: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

/**
 * 페이지 자원 관리 페이지
 * @returns ResourcePage
 */
function ResourcePage() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/page');
  // 코드 조회
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);

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
    code: '',
    name: '',
    description: '',
    url: '',
    status: 'ENABLE',
  });

  const { code, name, description, url, status } = form;

  // 라벨들
  const {
    LABEL_RESOURCE_PAGE_CODE,
    LABEL_RESOURCE_PAGE_NAME,
    LABEL_RESOURCE_PAGE_DESCRIPTION,
    LABEL_RESOURCE_PAGE_STATUS,
    LABEL_RESOURCE_PAGE_URL,
    LABEL_RESOURCE_PAGE_LIST,
    LABEL_RESOURCE_PAGE_CAPTION,
  } = useLabels(pageData);

  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_PAGE_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_PAGE_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_PAGE_DESCRIPTION',
        name: 'description',
        width: 450,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_PAGE_STATUS',
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
        label: 'LABEL_RESOURCE_PAGE_URL',
        name: 'url',
        width: 350,
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

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  // 페이지 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
    }));
    getPages();
  };

  // 페이지 데이터 조회
  const [pages, getPages]: any = useAsyncGetAction(
    () => pageData && getAction('/api/resources/pages'),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 페이지 등록
  const [postPage, postPageValid] = useAsyncAction(
    () => postAction('/api/resources/pages', form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 페이지 수정
  const [putPage, putPageValid] = useAsyncAction(
    () => putAction('/api/resources/pages/' + row.resourceId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 페이지 삭제
  const [deletePage] = useAsyncAction(
    () => deleteAction('/api/resources/pages/' + row.resourceId),
    {
      onSuccess: asyncSucCallback,
      onError: () => {
        setPageState((state) => ({
          ...state,
          openDeleteDialog: false,
        }));
      },
    },
  );

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/
  // 테이블 버튼들
  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_PAGE_ADD',
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
      id: 'BTN_RESOURCE_PAGE_MODIFY',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: true,
          openModal: true,
        }));
        buttonType = 'put';

        replaceForm({
          name: row.name,
          description: row.description,
          status: row.status,
          code: row.code,
          url: row.url,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_PAGE_DELETE',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // 테이블 select 시 콜백
  const onSelectRow = useCallback((id: string, rowValue: any) => {
    row = rowValue;
    setPageState((state) => ({
      ...state,
      disableButton: false,
    }));
  }, []);

  // 페이지 저장
  const onSavePage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postPage();
    } else if (buttonType === 'put') {
      putPage();
    }
  };

  // Validation
  const pageValid = mergeValid([postPageValid, putPageValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deletePage}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
      <Table
        caption={LABEL_RESOURCE_PAGE_LIST}
        model={model}
        buttons={buttons}
        data={pages ? pages.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal visible={pageState.openModal} title={LABEL_RESOURCE_PAGE_CAPTION}>
        <Form onSubmit={onSavePage}>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_PAGE_CODE}
              value={code}
              onChange={onChangeForm}
              name="code"
              disabled={pageState.disableItem}
              validation={pageValid.code}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_PAGE_NAME}
              value={name}
              onChange={onChangeForm}
              name="name"
              validation={pageValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_RESOURCE_PAGE_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_PAGE_URL}
              value={url}
              onChange={onChangeForm}
              name="url"
              validation={pageValid.url}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_PAGE_STATUS}
              data={enableCodes}
              defaultValue={defaultValue}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={pageValid.status}
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

export default ResourcePage;
