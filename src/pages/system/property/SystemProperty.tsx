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
  SearchButton,
  Table,
  TableModelProps,
  useChange,
} from 'doif-react-kit';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import useAsyncAction, {
  deleteAction,
  postAction,
  putAction,
} from '../../../hooks/useAsyncAction';
import useAsyncGetAction, { getAction } from '../../../hooks/useAsyncGetAction';
import { ButtonInfoProps } from '../../../hooks/useButtons';
import useLabels from '../../../hooks/useLabels';
import usePage from '../../../hooks/usePage';
import useButtons from '../../../hooks/useButtons';
import useTableModel from '../../../hooks/useTableModel';
import useCodes from '../../../hooks/useCodes';
import mergeValid from '../../../common/mergeValid';
import { defaultValue } from '../../../common/commonValue';

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

  // 검색 조건 데이터
  const [searchForm, onChangeSearchForm, replaceSearchForm, resetSearchForm] =
    useChange({
      searchPropertyGroup: '',
    });

  const { propertyGroup, property, value, description, updatable } = form;
  const { searchPropertyGroup } = searchForm;

  // 라벨들
  const {
    LABEL_SYSTEM_PROPERTY_GROUP,
    LABEL_SYSTEM_PROPERTY_PROPERTY,
    LABEL_SYSTEM_PROPERTY_VALUE,
    LABEL_SYSTEM_PROPERTY_DESCRIPTION,
    LABEL_SYSTEM_PROPERTY_UPDATEABLE,
    LABEL_SYSTEM_PROPERTY_LIST,
    LABEL_SYSTEM_PROPERTY_CAPTION,
  } = useLabels(pageData);

  // 코드
  const [propertyGroupType]: any = useCodes('PROPERTY_GROUP_TYPE', pageData);
  const updatableCodes = useMemo(
    () => [
      {
        code: 'true',
        name: '변경 가능',
      },
      {
        code: 'false',
        name: '변경 불가능',
      },
    ],
    [],
  );
  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SYSTEM_PROPERTY_GROUP',
        name: 'propertyGroupName',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SYSTEM_PROPERTY_PROPERTY',
        name: 'property',
        width: 350,
        align: 'left',
      },
      {
        label: 'LABEL_SYSTEM_PROPERTY_VALUE',
        name: 'value',
        width: 350,
        align: 'left',
      },
      {
        label: 'LABEL_SYSTEM_PROPERTY_DESCRIPTION',
        name: 'description',
        width: 450,
        align: 'left',
      },
      {
        label: 'LABEL_SYSTEM_PROPERTY_UPDATEABLE',
        name: 'updatableName',
        width: 120,
      },
      {
        label: '',
        name: 'systemPropertyId',
        hidden: true,
      },
      {
        label: '',
        name: 'propertyGroup',
        hidden: true,
      },
      {
        label: '',
        name: 'updatable',
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
    getSystemProperties();
  };

  // 시스템 속성 데이터 조회
  const [systemProperties, getSystemProperties]: any = useAsyncGetAction(
    () =>
      pageData &&
      getAction('/api/system-properties', {
        propertyGroup: searchPropertyGroup,
      }),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 시스템 속성 등록
  const [postSystemProperty, postSystemPropertyValid] = useAsyncAction(
    () => postAction('/api/system-properties', form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 시스템 속성 수정
  const [putSystemProperty, putSystemPropertyValid] = useAsyncAction(
    () => putAction('/api/system-properties/' + row.systemPropertyId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 시스템 속성 삭제
  const [deleteSystemProperty] = useAsyncAction(
    () => deleteAction('/api/system-properties/' + row.systemPropertyId),
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
      id: 'BTN_SYSTEM_PROPERTY_ADD',
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
      id: 'BTN_SYSTEM_PROPERTY_MODIFY',
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
      id: 'BTN_SYSTEM_PROPERTY_DELETE',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // 시스템 속성 조회
  const onSearchSystemProperty = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getSystemProperties();
  };

  // 테이블 select 시 콜백
  const onSelectRow = useCallback((id: string, rowValue: any) => {
    row = rowValue;
    setPageState((state) => ({
      ...state,
      disableButton: false,
    }));
  }, []);

  // 시스템 속성 저장
  const onSaveSystemProperty = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postSystemProperty();
    } else if (buttonType === 'put') {
      putSystemProperty();
    }
  };

  // Validation
  const systemPropertyValid = mergeValid([
    postSystemPropertyValid,
    putSystemPropertyValid,
  ]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteSystemProperty}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />

      <Form onSubmit={onSearchSystemProperty}>
        <Row>
          <LabelSelect
            label={LABEL_SYSTEM_PROPERTY_GROUP}
            width="300px"
            defaultValue={defaultValue}
            data={propertyGroupType}
            value={searchPropertyGroup}
            onChange={onChangeSearchForm}
            name="searchPropertyGroup"
          />
        </Row>
        <InFormContainer align="right">
          <SearchButton />
        </InFormContainer>
      </Form>

      <Table
        caption={LABEL_SYSTEM_PROPERTY_LIST}
        model={model}
        buttons={buttons}
        data={systemProperties ? systemProperties.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal
        visible={pageState.openModal}
        title={LABEL_SYSTEM_PROPERTY_CAPTION}
      >
        <Form onSubmit={onSaveSystemProperty}>
          {/* <Row>
            <LabelSelect
              required
              label={LABEL_SYSTEM_PROPERTY_GROUP}
              defaultValue={defaultValue}
              data={propertyGroupType}
              value={propertyGroup}
              onChange={onChangeForm}
              name="propertyGroup"
              disabled={pageState.disableItem}
              validation={systemPropertyValid.propertyGroup}
            />
          </Row> */}
          <Row>
            <LabelInput
              required
              label={LABEL_SYSTEM_PROPERTY_PROPERTY}
              value={property}
              onChange={onChangeForm}
              name="property"
              disabled={pageState.disableItem}
              validation={systemPropertyValid.property}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label={LABEL_SYSTEM_PROPERTY_VALUE}
              value={value}
              onChange={onChangeForm}
              name="value"
              validation={systemPropertyValid.value}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_SYSTEM_PROPERTY_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_SYSTEM_PROPERTY_UPDATEABLE}
              data={updatableCodes}
              value={updatable}
              onChange={onChangeForm}
              name="updatable"
              validation={systemPropertyValid.updatable}
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

export default SystemProperty;
