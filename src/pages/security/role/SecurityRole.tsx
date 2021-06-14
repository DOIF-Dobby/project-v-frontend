import {
  Button,
  CloseButton,
  Column,
  Container,
  DeleteDialog,
  Field,
  Form,
  Icon,
  InFormContainer,
  Label,
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
import { FormEvent, useCallback, useEffect, useState } from 'react';
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

// roleResource Page checked
let checkedRoleResourcePage: any = {};

// roleResource Button checked
let checkedRoleResourceButton: any = {};

// roleResource Tab checked
let checkedRoleResourceTab: any = {};
/**
 * 페이지 자원 관리 페이지
 * @returns SecurityRole
 */
function SecurityRole() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/security/role');
  // 코드 조회
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);

  // 버튼 자원 목록 데이터
  const [roleResourceButtonDatas, setRoleResourceButtonDatas] = useState<any>(
    [],
  );

  // 탭 자원 목록 데이터
  const [roleResourceTabDatas, setRoleResourceTabDatas] = useState<any>([]);

  // 초기 페이지 상태
  const initPageState = {
    openModal: false,
    disableButton: true,
    openDeleteDialog: false,
    disableItem: false,
    openRoleResourceModal: false,
  };

  // 페이지 상태
  const [pageState, setPageState] = useState(initPageState);

  // form 데이터
  const [form, onChangeForm, replaceForm, resetForm] = useChange({
    name: '',
    description: '',
    status: 'ENABLE',
  });

  const { name, description, status } = form;

  // 라벨들
  const {
    LABEL_SECURITY_ROLE_NAME,
    LABEL_SECURITY_ROLE_DESCRIPTION,
    LABEL_SECURITY_ROLE_STATUS,
    LABEL_SECURITY_ROLE_LIST,
    LABEL_SECURITY_ROLE_CAPTION,
    LABEL_SECURITY_ROLE_RESOURCE_CAPTION,
    LABEL_SECURITY_ROLE_RESOURCE_PAGE_LIST,
    LABEL_SECURITY_ROLE_RESOURCE_BUTTON_LIST,
    LABEL_SECURITY_ROLE_RESOURCE_TAB_LIST,
  } = useLabels(pageData);

  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_ROLE_ID',
        name: 'roleId',
        width: 100,
      },
      {
        label: 'LABEL_SECURITY_ROLE_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_ROLE_DESCRIPTION',
        name: 'description',
        width: 450,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_ROLE_STATUS',
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
    ],
    pageData,
  );

  // RoleResource page model
  const pageModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_ROLE_RESOURCE_PAGE_NAME',
        name: 'name',
        width: 350,
        align: 'left',
      },
      {
        label: '',
        name: 'checked',
        width: 50,
        formatter: (cellvalue: any, rowValue: any) => {
          return (
            <input
              type="checkbox"
              checked={checkedRoleResourcePage[rowValue.pageId]}
              onChange={(e) => {
                checkedRoleResourcePage[rowValue.pageId] = e.target.checked;
              }}
            />
          );
        },
      },
      {
        label: 'LABEL_SECURITY_ROLE_STATUS',
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
        name: 'pageId',
        hidden: true,
      },
    ],
    pageData,
  );

  // RoleResource button model
  const buttonModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_ROLE_RESOURCE_BUTTON_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_ROLE_RESOURCE_BUTTON_DESCRIPTION',
        name: 'description',
        width: 400,
        align: 'left',
      },
      {
        label: '',
        name: 'checked',
        width: 50,
        formatter: (cellvalue: any, rowValue: any) => {
          return (
            <input
              type="checkbox"
              checked={checkedRoleResourceButton[rowValue.buttonId]}
              onChange={(e) => {
                checkedRoleResourceButton[rowValue.buttonId] = e.target.checked;
              }}
            />
          );
        },
      },
      {
        label: 'LABEL_SECURITY_ROLE_STATUS',
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
        name: 'buttonId',
        hidden: true,
      },
    ],
    pageData,
  );

  // RoleResource tab model
  const tabModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_ROLE_RESOURCE_TAB_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_ROLE_RESOURCE_TAB_DESCRIPTION',
        name: 'description',
        width: 400,
        align: 'left',
      },
      {
        label: '',
        name: 'checked',
        width: 50,
        formatter: (cellvalue: any, rowValue: any) => {
          return (
            <input
              type="checkbox"
              checked={checkedRoleResourceTab[rowValue.tabId]}
              onChange={(e) => {
                checkedRoleResourceTab[rowValue.tabId] = e.target.checked;
              }}
            />
          );
        },
      },
      {
        label: 'LABEL_SECURITY_ROLE_STATUS',
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
        name: 'tabId',
        hidden: true,
      },
    ],
    pageData,
  );

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  // Role 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
    }));
    getRoles();
  };

  // Role 데이터 조회
  const [roles, getRoles]: any = useAsyncGetAction(
    () => pageData && getAction('/api/roles'),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // Role 등록
  const [postRole, postRoleValid] = useAsyncAction(
    () => postAction('/api/roles', form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // Role 수정
  const [putRole, putRoleValid] = useAsyncAction(
    () => putAction('/api/roles/' + row.roleId, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // Role 삭제
  const [deleteRole] = useAsyncAction(
    () => deleteAction('/api/roles/' + row.roleId),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // RoleResource Page 조회
  const [roleResourcePages, getRoleResourcePages] = useAsyncGetAction(
    () =>
      pageData &&
      getAction('/api/role-resources/pages', {
        roleId: row.roleId,
      }),
    [pageData],
    {
      skip: true,
    },
  );

  // Role Resource 할당
  const [allocateRoleResource] = useAsyncAction(
    () => {
      const checkedPageIds = [];
      const checkedButtonIds = [];
      const checkedTabIds = [];

      for (const pageId in checkedRoleResourcePage) {
        if (checkedRoleResourcePage[pageId]) {
          checkedPageIds.push(pageId);
        }
      }

      for (const buttonId in checkedRoleResourceButton) {
        if (checkedRoleResourceButton[buttonId]) {
          checkedButtonIds.push(buttonId);
        }
      }

      for (const tabId in checkedRoleResourceTab) {
        if (checkedRoleResourceTab[tabId]) {
          checkedTabIds.push(tabId);
        }
      }

      return postAction('/api/role-resources', {
        roleId: row.roleId,
        pages: checkedPageIds,
        buttons: checkedButtonIds,
        tabs: checkedTabIds,
      });
    },
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openRoleResourceModal: false }));
      },
    },
  );

  useEffect(() => {
    if (roleResourcePages) {
      roleResourcePages.content.forEach((roleResourcePage: any) => {
        checkedRoleResourcePage[roleResourcePage.pageId] =
          roleResourcePage.checked;

        if (roleResourcePage.buttons && roleResourcePage.buttons.length > 0) {
          roleResourcePage.buttons.forEach((roleResourceButton: any) => {
            checkedRoleResourceButton[roleResourceButton.buttonId] =
              roleResourceButton.checked;
          });
        }

        if (roleResourcePage.tabs && roleResourcePage.tabs.length > 0) {
          roleResourcePage.tabs.forEach((roleResourceTab: any) => {
            checkedRoleResourceTab[roleResourceTab.tabId] =
              roleResourceTab.checked;
          });
        }
      });
    }
  }, [roleResourcePages]);

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/
  // 테이블 버튼들
  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_SECURITY_ROLE_ADD',
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
      id: 'BTN_SECURITY_ROLE_MODIFY',
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
        });
      },
    },
    {
      id: 'BTN_SECURITY_ROLE_DELETE',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
    {
      id: 'BTN_SECURITY_ROLE_RESOURCE_PAGE_FIND',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getRoleResourcePages();
        setPageState((state) => ({ ...state, openRoleResourceModal: true }));
        setRoleResourceButtonDatas([]);
        setRoleResourceTabDatas([]);
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

  // roleResourcePage 테이블 select 시 콜백
  const onSelectRoleResourcePageRow = useCallback(
    (id: string, rowValue: any) => {
      setRoleResourceButtonDatas(rowValue.buttons);
      setRoleResourceTabDatas(rowValue.tabs);
    },
    [],
  );

  // Role 저장
  const onSaveRole = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postRole();
    } else if (buttonType === 'put') {
      putRole();
    }
  };

  // RoleResource 할당
  const onAllocateRoleResource = () => {
    allocateRoleResource();
  };

  // Validation
  const roleValid = mergeValid([postRoleValid, putRoleValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  // user role 할당 버튼
  const allocateButton =
    pageData.buttonMap['BTN_SECURITY_ROLE_RESOURCE_ALLOCATE'];

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteRole}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
      <Table
        caption={LABEL_SECURITY_ROLE_LIST}
        model={model}
        buttons={buttons}
        data={roles ? roles.content : []}
        onSelectRow={onSelectRow}
      />

      {/* Role 등록/수정 모달 */}
      <Modal visible={pageState.openModal} title={LABEL_SECURITY_ROLE_CAPTION}>
        <Form onSubmit={onSaveRole}>
          <Row>
            <LabelInput
              required
              label={LABEL_SECURITY_ROLE_NAME}
              value={name}
              onChange={onChangeForm}
              name="name"
              disabled={pageState.disableItem}
              validation={roleValid.name}
            />
          </Row>
          <Row>
            <LabelInput
              label={LABEL_SECURITY_ROLE_DESCRIPTION}
              value={description}
              onChange={onChangeForm}
              name="description"
              validation={roleValid.description}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_SECURITY_ROLE_STATUS}
              data={enableCodes}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={roleValid.status}
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

      {/* Role Resource 모달 */}
      <Modal
        visible={pageState.openRoleResourceModal}
        title={LABEL_SECURITY_ROLE_RESOURCE_CAPTION}
        width="1500px"
      >
        <Container direction="column">
          <Form>
            <Row>
              <Column>
                <Label>Role 명</Label>
                <Field>{row.name}</Field>
              </Column>
            </Row>
          </Form>
          <Container>
            <div style={{ width: '40%' }}>
              <Table
                caption={LABEL_SECURITY_ROLE_RESOURCE_PAGE_LIST}
                model={pageModel}
                height="523px"
                data={roleResourcePages ? roleResourcePages.content : []}
                onSelectRow={onSelectRoleResourcePageRow}
                disableFilters
              />
            </div>
            <div style={{ width: '60%' }}>
              <Container direction="column">
                <Table
                  caption={LABEL_SECURITY_ROLE_RESOURCE_BUTTON_LIST}
                  model={buttonModel}
                  height="200px"
                  data={roleResourceButtonDatas}
                  disableFilters
                />
                <Table
                  caption={LABEL_SECURITY_ROLE_RESOURCE_TAB_LIST}
                  model={tabModel}
                  height="200px"
                  data={roleResourceTabDatas}
                  disableFilters
                />
              </Container>
            </div>
          </Container>
        </Container>

        <Container align="center" style={{ marginTop: '15px' }}>
          {allocateButton && (
            <Button onClick={onAllocateRoleResource}>
              <Icon icon={allocateButton.icon} />
              {allocateButton.name}
            </Button>
          )}
          <CloseButton
            onClick={() =>
              setPageState((state) => ({
                ...state,
                openRoleResourceModal: false,
              }))
            }
          />
        </Container>
      </Modal>
    </>
  );
}

export default SecurityRole;
