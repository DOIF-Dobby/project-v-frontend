import {
  Button,
  CloseButton,
  Container,
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

// userRole checked
let checkedUserRole: any = {};

/**
 * 유저 관리 페이지
 * @returns SecurityUser
 */
function SecurityUser() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/security/user');
  // 코드 조회
  const [userStatusCodes]: any = useCodes('USER_STATUS', pageData);

  // 초기 페이지 상태
  const initPageState = {
    openModal: false,
    disableButton: true,
    openDeleteDialog: false,
    disableItem: false,
    openRoleModal: false,
  };

  // 페이지 상태
  const [pageState, setPageState] = useState(initPageState);

  // form 데이터
  const [form, onChangeForm, replaceForm, resetForm] = useChange({
    id: '',
    name: '',
    password: '',
    status: 'VALID',
  });

  const { id, name, password, status } = form;

  // 라벨들
  const {
    LABEL_SECURITY_USER_ID,
    LABEL_SECURITY_USER_NAME,
    LABEL_SECURITY_USER_PASSWORD,
    LABEL_SECURITY_USER_STATUS,
    LABEL_SECURITY_USER_CAPTION,
    LABEL_SECURITY_USER_LIST,
    LABEL_SECURITY_USER_ROLE_CAPTION,
  } = useLabels(pageData);

  // 테이블 model
  const model: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_USER_ID',
        name: 'id',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_USER_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_USER_STATUS',
        name: 'statusName',
        width: 120,
        formatter: (cellValue: any) => {
          return cellValue.props.value === '유효' ? (
            <span style={{ color: '#02c902' }}>{cellValue}</span>
          ) : (
            <span style={{ color: '#fc3d3d' }}>{cellValue}</span>
          );
        },
      },
    ],
    pageData,
  );

  // Role 테이블 모델
  const roleTableModel: TableModelProps[] = useTableModel(
    [
      {
        label: 'LABEL_SECURITY_USER_ROLE_ID',
        name: 'roleId',
        width: 100,
      },
      {
        label: 'LABEL_SECURITY_USER_ROLE_NAME',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: 'LABEL_SECURITY_USER_ROLE_DESCRIPTION',
        name: 'description',
        width: 450,
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
              checked={checkedUserRole[rowValue.roleId]}
              onChange={(e) => {
                checkedUserRole[rowValue.roleId] = e.target.checked;
              }}
            />
          );
        },
      },
      {
        label: 'LABEL_SECURITY_USER_ROLE_STATUS',
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

  /******************************************************************
   * Action 함수들
   ******************************************************************/

  // 유저 등록/수정/삭제 시 성공 콜백
  const asyncSucCallback = () => {
    setPageState((state) => ({
      ...state,
      openModal: false,
      openDeleteDialog: false,
    }));
    getUsers();
  };

  // 유저 데이터 조회
  const [users, getUsers]: any = useAsyncGetAction(
    () => pageData && getAction('/api/users'),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 유저 등록
  const [postUser, postUserValid] = useAsyncAction(
    () => postAction('/api/users', form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 유저 수정
  const [putUser, putUserValid] = useAsyncAction(
    () => putAction('/api/users/' + row.id, form),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 유저 삭제
  const [deleteUser] = useAsyncAction(
    () => deleteAction('/api/users/' + row.id),
    {
      onSuccess: asyncSucCallback,
    },
  );

  // 유저 Role 조회
  const [userRoles, getUserRoles] = useAsyncGetAction(
    () => pageData && getAction('/api/users/' + row.id + '/user-roles'),
    [pageData],
    {
      skip: true,
    },
  );

  // 유저 Role 할당
  const [allocateUserRole] = useAsyncAction(
    () => {
      const checkedRoleIds = [];
      for (const roleId in checkedUserRole) {
        if (checkedUserRole[roleId]) {
          checkedRoleIds.push(roleId);
        }
      }

      return postAction('/api/user-roles', {
        userId: row.id,
        roleIds: checkedRoleIds,
      });
    },
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openRoleModal: false }));
      },
    },
  );

  useEffect(() => {
    if (userRoles) {
      userRoles.content.forEach((userRole: any) => {
        checkedUserRole[userRole.roleId] = userRole.checked;
      });
    }
  }, [userRoles]);

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/
  // 테이블 버튼들
  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_SECURITY_USER_ADD',
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
      id: 'BTN_SECURITY_USER_MODIFY',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableItem: true,
          openModal: true,
        }));
        buttonType = 'put';

        replaceForm({
          id: row.id,
          name: row.name,
          status: row.status,
        });
      },
    },
    {
      id: 'BTN_SECURITY_USER_DELETE',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteDialog: true }));
      },
    },
    {
      id: 'BTN_SECURITY_USER_ROLE_FIND',
      disable: pageState.disableButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        checkedUserRole = {};
        getUserRoles();
        setPageState((state) => ({ ...state, openRoleModal: true }));
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

  // 사용자 저장
  const onSaveUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postUser();
    } else if (buttonType === 'put') {
      putUser();
    }
  };

  // 사용자 Role 할당
  const onAllocateUserRole = () => {
    allocateUserRole();
  };

  // Validation
  const userValid = mergeValid([postUserValid, putUserValid]);

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  // user role 할당 버튼
  const allocateButton = pageData.buttonMap['BTN_SECURITY_USER_ROLE_ALLOCATE'];

  return (
    <>
      <DeleteDialog
        visible={pageState.openDeleteDialog}
        onConfirm={deleteUser}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteDialog: false }))
        }
      />

      <PageHeader menuName={pageData.menuName} menuList={pageData.menuList} />
      <Table
        caption={LABEL_SECURITY_USER_LIST}
        model={model}
        buttons={buttons}
        data={users ? users.pageInfo.content : []}
        onSelectRow={onSelectRow}
      />

      {/* 사용자 등록/수정 모달 */}
      <Modal visible={pageState.openModal} title={LABEL_SECURITY_USER_CAPTION}>
        <Form onSubmit={onSaveUser}>
          <Row>
            <LabelInput
              required
              label={LABEL_SECURITY_USER_ID}
              value={id}
              onChange={onChangeForm}
              name="id"
              disabled={pageState.disableItem}
              validation={userValid.id}
            />
          </Row>
          {!pageState.disableItem && (
            <Row>
              <LabelInput
                required
                label={LABEL_SECURITY_USER_PASSWORD}
                value={password}
                onChange={onChangeForm}
                name="password"
                type="password"
                validation={userValid.password}
              />
            </Row>
          )}
          <Row>
            <LabelInput
              required
              label={LABEL_SECURITY_USER_NAME}
              value={name}
              onChange={onChangeForm}
              name="name"
              validation={userValid.name}
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label={LABEL_SECURITY_USER_STATUS}
              data={userStatusCodes}
              value={status}
              onChange={onChangeForm}
              name="status"
              validation={userValid.status}
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

      {/* 사용자 Role 모달 */}
      <Modal
        visible={pageState.openRoleModal}
        title={LABEL_SECURITY_USER_ROLE_CAPTION}
        width="1200px"
      >
        <Table
          caption={LABEL_SECURITY_USER_ROLE_CAPTION}
          model={roleTableModel}
          data={userRoles ? userRoles.content : []}
          disableFilters
        />

        <Container align="center" style={{ marginTop: '15px' }}>
          {allocateButton && (
            <Button onClick={onAllocateUserRole}>
              <Icon icon={allocateButton.icon} />
              {allocateButton.name}
            </Button>
          )}
          <CloseButton
            onClick={() =>
              setPageState((state) => ({ ...state, openRoleModal: false }))
            }
          />
        </Container>
      </Modal>
    </>
  );
}

export default SecurityUser;
