import {
  CloseButton,
  DeleteDialog,
  Form,
  Icon,
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
import usePage from '../../../hooks/usePage';

// table row data
let row: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

// 페이지 자원 페이지
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
    status: '',
  });

  const { code, name, description, url, status } = form;

  // 테이블 model
  const model: TableModelProps[] = useMemo(
    () => [
      {
        label: '페이지 코드',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: '페이지명',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: '설명',
        name: 'description',
        width: 450,
        align: 'left',
      },
      {
        label: '사용 가능 상태',
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
        label: 'URL',
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
    [],
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
        caption="페이지 자원 목록"
        model={model}
        buttons={buttons}
        data={pages ? pages.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal visible={pageState.openModal} title="페이지 등록/수정">
        <Form onSubmit={onSavePage}>
          <Row>
            <LabelInput
              required
              label="페이지 코드"
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
              label="페이지명"
              value={name}
              onChange={onChangeForm}
              name="name"
              validation={pageValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label="페이지 설명"
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="URL"
              value={url}
              onChange={onChangeForm}
              name="url"
              validation={pageValid.url}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="사용 가능 상태"
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
