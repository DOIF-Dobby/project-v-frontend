import {
  CloseButton,
  DeleteDialog,
  Form,
  InFormContainer,
  LabelInput,
  LabelSelect,
  Loading,
  Modal,
  Row,
  SaveButton,
  Table,
  TableModelProps,
  useChange,
} from 'doif-react-kit';
import { FormEvent, useCallback, useState } from 'react';
import { defaultValue } from '../../../common/commonValue';
import mergeValid from '../../../common/mergeValid';
import PageHeaderInfo from '../../../components/PageHeaderInfo';
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
 * 메세지 자원 관리 페이지
 * @returns ResourceMessage
 */
function ResourceMessage() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/message');
  // 코드 조회
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);
  // 코드 조회
  const [messageTypes]: any = useCodes('MESSAGE_TYPE', pageData);

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
    type: '',
    status: 'ENABLE',
  });

  const { code, name, description, type, status } = form;

  // 라벨들
  const {
    LABEL_RESOURCE_MESSAGE_CODE,
    LABEL_RESOURCE_MESSAGE_NAME,
    LABEL_RESOURCE_MESSAGE_DESCRIPTION,
    LABEL_RESOURCE_MESSAGE_STATUS,
    LABEL_RESOURCE_MESSAGE_TYPE,
    LABEL_RESOURCE_MESSAGE_LIST,
    LABEL_RESOURCE_MESSAGE_CAPTION,
  } = useLabels(pageData);

  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_RESOURCE_MESSAGE_CODE',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_NAME',
        name: 'name',
        width: 500,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_DESCRIPTION',
        name: 'description',
        width: 500,
        align: 'left',
      },
      {
        label: 'LABEL_RESOURCE_MESSAGE_STATUS',
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
        label: 'LABEL_RESOURCE_MESSAGE_TYPE',
        name: 'typeName',
        width: 120,
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

  // 메세지 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
    }));
    getMessages();
  };

  // 메세지 데이터 조회
  const [messages, getMessages]: any = useAsyncGetAction(
    () => pageData && getAction('/api/resources/messages'),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 메세지 등록
  const [postMessage, postMessageValid] = useAsyncAction(
    () => postAction('/api/resources/messages', form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 페이지 수정
  const [putMessage, putMessageValid] = useAsyncAction(
    () => putAction('/api/resources/messages/' + row.resourceId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 페이지 삭제
  const [deleteMessage] = useAsyncAction(
    () => deleteAction('/api/resources/messages/' + row.resourceId),
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
      id: 'BTN_RESOURCE_MESSAGE_ADD',
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
      id: 'BTN_RESOURCE_MESSAGE_MODIFY',
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
          type: row.type,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_MESSAGE_DELETE',
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

  // 메세지 저장
  const onSaveMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postMessage();
    } else if (buttonType === 'put') {
      putMessage();
    }
  };

  // 메세지 이름 blur 이벤트
  const onBlurName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!description) {
      replaceForm({
        ...form,
        description: name,
      });
    }
  };

  // Validation
  const messageValid = mergeValid([postMessageValid, putMessageValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteMessage}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeaderInfo pageData={pageData} />

      <Table
        caption={LABEL_RESOURCE_MESSAGE_LIST}
        model={model}
        buttons={buttons}
        data={messages ? messages.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal
        visible={pageState.openModal}
        title={LABEL_RESOURCE_MESSAGE_CAPTION}
      >
        <Form onSubmit={onSaveMessage}>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_MESSAGE_CODE}
              value={code}
              onChange={onChangeForm}
              name="code"
              disabled={pageState.disableItem}
              validation={messageValid.code}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_RESOURCE_MESSAGE_NAME}
              value={name}
              onChange={onChangeForm}
              onBlur={onBlurName}
              name="name"
              validation={messageValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_RESOURCE_MESSAGE_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_MESSAGE_TYPE}
              data={messageTypes}
              value={type}
              defaultValue={defaultValue}
              onChange={onChangeForm}
              name="type"
              validation={messageValid.type}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_RESOURCE_MESSAGE_STATUS}
              data={enableCodes}
              defaultValue={defaultValue}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={messageValid.status}
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

export default ResourceMessage;
