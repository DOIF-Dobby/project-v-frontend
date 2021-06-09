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
import React, { FormEvent, useCallback, useState } from 'react';
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
let labelRow: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

/**
 * 라벨 자원 관리 페이지
 * @returns ResourceLabel
 */
function ResourceLabel() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/label');
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
  });

  const { code, name, description, status } = form;

  // 라벨들
  const {
    LABEL_RESOURCE_LABEL_CODE,
    LABEL_RESOURCE_LABEL_NAME,
    LABEL_RESOURCE_LABEL_DESCRIPTION,
    LABEL_RESOURCE_LABEL_STATUS,
    LABEL_RESOURCE_LABEL_CAPTION,
    LABEL_RESOURCE_LABEL_LIST,
    LABEL_RESOURCE_LABEL_PAGE_LIST,
  } = useLabels(pageData);

  // 페이지 테이블 model
  const pageTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_LABEL_PAGE_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_LABEL_PAGE_NAME',
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

  // 라벨 테이블 model
  const labelTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_LABEL_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_LABEL_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_LABEL_DESCRIPTION',
        name: 'description',
        width: 300,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_LABEL_STATUS',
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
    getLabels();
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

  // 라벨 데이터 조회
  const [labels, getLabels]: any = useAsyncGetAction(
    () =>
      pageData &&
      getAction(`/api/resources/pages/${pageRow.resourceId}/labels`),
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

  // 라벨 등록
  const [postLabel, postLabelValid] = useAsyncAction(
    () =>
      postAction('/api/resources/labels', {
        ...form,
        pageId: pageRow.resourceId,
      }),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 라벨 수정
  const [putLabel, putLabelValid] = useAsyncAction(
    () => putAction('/api/resources/labels/' + labelRow.resourceId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 라벨 삭제
  const [deleteLabel] = useAsyncAction(
    () => deleteAction('/api/resources/labels/' + labelRow.resourceId),
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
      id: 'BTN_RESOURCE_LABEL_ADD',
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
      id: 'BTN_RESOURCE_LABEL_MODIFY',
      disable: pageState.disablePutDeleteButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: true,
          openModal: true,
        }));
        buttonType = 'put';

        replaceForm({
          name: labelRow.name,
          description: labelRow.description,
          status: labelRow.status,
          code: labelRow.code,
          pageId: labelRow.pageId,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_LABEL_DELETE',
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

      getLabels();
    },
    [getLabels],
  );

  // 라벨 자원 목록 테이블 select 시 콜백
  const onSelectLabelTableRow = useCallback((id: string, rowValue: any) => {
    labelRow = rowValue;
    setPageState((state) => ({
      ...state,
      disablePutDeleteButton: false,
    }));
  }, []);

  // 라벨 저장
  const onSaveLabel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postLabel();
    } else if (buttonType === 'put') {
      putLabel();
    }
  };

  // 라벨 이름 blur 이벤트
  const onBlurName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!description) {
      replaceForm({
        ...form,
        description: name,
      });
    }
  };

  // Validation
  const labelValid = mergeValid([postLabelValid, putLabelValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteLabel}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />

      <Container>
        <div style={{ width: '35%' }}>
          <Table
            caption={LABEL_RESOURCE_LABEL_PAGE_LIST}
            model={pageTableModel}
            data={pages ? pages.content : []}
            onSelectRow={onSelectPageTableRow}
          />
        </div>
        <div style={{ width: '65%' }}>
          <Table
            caption={LABEL_RESOURCE_LABEL_LIST}
            buttons={buttons}
            model={labelTableModel}
            data={labels ? labels.content : []}
            onSelectRow={onSelectLabelTableRow}
          />
        </div>
      </Container>

      <Modal visible={pageState.openModal} title={LABEL_RESOURCE_LABEL_CAPTION}>
        <Form onSubmit={onSaveLabel}>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_LABEL_CODE}
              value={code}
              onChange={onChangeForm}
              name="code"
              disabled={pageState.disableItem}
              validation={labelValid.code}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_LABEL_NAME}
              value={name}
              onChange={onChangeForm}
              onBlur={onBlurName}
              name="name"
              validation={labelValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_RESOURCE_LABEL_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_LABEL_STATUS}
              data={enableCodes}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={labelValid.status}
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

export default ResourceLabel;
