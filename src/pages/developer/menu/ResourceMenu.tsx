import {
  Button,
  CloseButton,
  Container,
  Dialog,
  Form,
  Icon,
  iconTypes,
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
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { defaultValue } from '../../../common/commonValue';
import useAsyncAction, {
  deleteAction,
  postAction,
  putAction,
} from '../../../hooks/useAsyncAction';
import useAsyncGetAction, { getAction } from '../../../hooks/useAsyncGet';
import useButtons, { ButtonInfoProps } from '../../../hooks/useButtons';
import useCodes from '../../../hooks/useCodes';
import usePage from '../../../hooks/usePage';

// table row data
let row: any = {};
// button 클릭시 등록/수정 타입
let buttonType: string = '';

// 메뉴 자원 페이지
function ResourceMenu() {
  /******************************************************************
   * 기본 데이터 및 state
   *******************************************************************/
  // 페이지 데이터 조회
  const [pageData] = usePage('/api/pages/resources/menu');
  // 코드 조회
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);
  // 상위 카테고리 조회
  const [
    hierarchyCategories,
    getHierarchyCategories,
  ]: any = useAsyncGetAction(
    () =>
      pageData && getAction('/api/resources/menu-categories/hierarchy-code'),
    [pageData],
  );

  // 초기 페이지 상태
  const initPageState = {
    openMenuModal: false,
    openCategoryModal: false,
    disableMenuButton: true,
    disableCategoryButton: true,
    openDeleteMenuDialog: false,
    openDeleteCategoryDialog: false,
    disableMenuItem: false,
    disableCategoryItem: false,
  };

  // 페이지 상태
  const [pageState, setPageState] = useState(initPageState);

  // menu form 데이터
  const [
    menuForm,
    onChangeMenuForm,
    replaceMenuForm,
    resetMenuForm,
  ] = useChange({
    menuCode: '',
    menuName: '',
    menuDescription: '',
    menuCategory: '',
    menuUrl: '',
    menuStatus: '',
    menuIcon: '',
    menuSort: '',
  });

  const {
    menuCode,
    menuName,
    menuDescription,
    menuCategory,
    menuUrl,
    menuStatus,
    menuIcon,
    menuSort,
  } = menuForm;

  // category form 데이터
  const [
    categoryForm,
    onChangeCategoryForm,
    replaceCategoryForm,
    resetCategoryForm,
  ] = useChange({
    categoryCode: '',
    categoryName: '',
    categoryDescription: '',
    categoryParent: '',
    categoryStatus: '',
    categoryIcon: '',
    categorySort: '',
  });

  const {
    categoryCode,
    categoryName,
    categoryDescription,
    categoryParent,
    categoryStatus,
    categoryIcon,
    categorySort,
  } = categoryForm;

  // 조회 해온 상위 카테고리 데이터 가공
  const hierarchyCategoriesData = hierarchyCategories?.map(
    ({ code, name, render }: any) => ({
      code,
      name,
      render: (
        <div style={{ paddingLeft: (render - 1) * 10 + 'px' }}>{name}</div>
      ),
    }),
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

  // 테이블 model
  const model: TableModelProps[] = useMemo(
    () => [
      {
        label: '메뉴명',
        name: 'name',
        width: 250,
        align: 'left',
      },
      {
        label: '메뉴 코드',
        name: 'code',
        width: 250,
        align: 'left',
      },
      {
        label: '설명',
        name: 'description',
        width: 350,
        align: 'left',
      },
      {
        label: '사용 가능 상태',
        name: 'statusName',
        width: 120,
      },
      {
        label: 'URL',
        name: 'url',
        width: 250,
        align: 'left',
      },
      {
        label: '아이콘',
        name: 'icon',
        width: 120,
        formatter: (cellValue: any) => {
          return cellValue.props.value ? (
            <Icon icon={cellValue.props.value} />
          ) : (
            cellValue
          );
        },
      },
      {
        label: '구분',
        name: 'typeName',
        width: 120,
      },
      {
        label: '정렬 순서',
        name: 'sort',
        width: 100,
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
  // menu 데이터 조회
  const [menus, getMenus]: any = useAsyncGetAction(
    () => pageData && getAction(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url),
    [pageData],
    {
      skip: false,
      onSuccess: () => {
        setPageState(initPageState);
      },
    },
  );

  // 메뉴 등록
  const [postMenu] = useAsyncAction(
    () =>
      postAction(pageData.buttonMap.BTN_RESOURCE_MENU_ADD.url, {
        name: menuName,
        description: menuDescription,
        status: menuStatus,
        code: menuCode,
        menuCategoryId: menuCategory,
        url: menuUrl,
        icon: menuIcon,
        sort: menuSort,
      }),
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openMenuModal: false }));
        getMenus();
        getHierarchyCategories();
      },
    },
  );

  // 메뉴 수정
  const [putMenu] = useAsyncAction(
    () =>
      putAction('/api/resources/menus/' + row.resourceId, {
        name: menuName,
        description: menuDescription,
        status: menuStatus,
        code: menuCode,
        menuCategoryId: menuCategory,
        url: menuUrl,
        icon: menuIcon,
        sort: menuSort,
      }),
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openMenuModal: false }));
        getMenus();
        getHierarchyCategories();
      },
    },
  );

  // 메뉴 삭제
  const [deleteMenu] = useAsyncAction(
    () => deleteAction('/api/resources/menus/' + row.resourceId),
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openDeleteMenuDialog: false }));
        getMenus();
        getHierarchyCategories();
      },
      onError: () => {
        handleError();
      },
    },
  );

  // 카테고리 등록
  const [postCategory] = useAsyncAction(
    () =>
      postAction('/api/resources/menu-categories', {
        name: categoryName,
        description: categoryDescription,
        status: categoryStatus,
        code: categoryCode,
        parentId: categoryParent,
        sort: categorySort,
        icon: categoryIcon,
      }),
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openCategoryModal: false }));
        getMenus();
        getHierarchyCategories();
      },
    },
  );

  // 카테고리 수정
  const [putCategory] = useAsyncAction(
    () =>
      putAction('/api/resources/menu-categories/' + row.resourceId, {
        name: categoryName,
        description: categoryDescription,
        status: categoryStatus,
        code: categoryCode,
        parentId: categoryParent,
        sort: categorySort,
        icon: categoryIcon,
      }),
    {
      onSuccess: () => {
        setPageState((state) => ({ ...state, openCategoryModal: false }));
        getMenus();
        getHierarchyCategories();
      },
    },
  );

  // 카테고리 삭제
  const [deleteCategory] = useAsyncAction(
    () => deleteAction('/api/resources/menu-categories/' + row.resourceId),
    {
      onSuccess: () => {
        setPageState((state) => ({
          ...state,
          openDeleteCategoryDialog: false,
        }));
        getMenus();
        getHierarchyCategories();
      },
      onError: () => {
        handleError();
      },
    },
  );

  /******************************************************************
   * 클라이언트 함수들
   ******************************************************************/
  // 테이블 버튼들
  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_MENU_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableMenuItem: false,
          openMenuModal: true,
        }));
        buttonType = 'post';

        resetMenuForm();
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_MODIFY',
      disable: pageState.disableMenuButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableMenuItem: true,
          openMenuModal: true,
        }));
        buttonType = 'put';

        replaceMenuForm({
          menuCode: row.code,
          menuName: row.name,
          menuDescription: row.description,
          menuCategory: String(row.parentId),
          menuUrl: row.url,
          menuStatus: row.status,
          menuIcon: row.icon,
          menuSort: row.sort,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_DELETE',
      disable: pageState.disableMenuButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteMenuDialog: true }));
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_CATEGORY_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableCategoryItem: false,
          openCategoryModal: true,
        }));
        buttonType = 'post';

        resetCategoryForm();
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_CATEGORY_MODIFY',
      disable: pageState.disableCategoryButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({
          ...state,
          disableCategoryItem: true,
          openCategoryModal: true,
        }));
        buttonType = 'put';

        replaceCategoryForm({
          categoryCode: row.code,
          categoryName: row.name,
          categoryDescription: row.description,
          categoryParent: String(row.parentId),
          categoryStatus: row.status,
          categoryIcon: row.icon,
          categorySort: row.sort,
        });
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_CATEGORY_DELETE',
      disable: pageState.disableCategoryButton,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setPageState((state) => ({ ...state, openDeleteCategoryDialog: true }));
      },
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  // error 핸들링 함수
  const handleError = () => {
    setPageState((state) => ({
      ...state,
      openDeleteMenuDialog: false,
      openDeleteCategoryDialog: false,
    }));
  };

  // 테이블 select 시 콜백
  const onSelectRow = useCallback((id: string, rowValue: any) => {
    row = rowValue;
    if (rowValue.type === 'MENU') {
      setPageState((state) => ({
        ...state,
        disableMenuButton: false,
        disableCategoryButton: true,
      }));
    } else {
      setPageState((state) => ({
        ...state,
        disableMenuButton: true,
        disableCategoryButton: false,
      }));
    }
  }, []);

  // 카테고리 저장
  const onSaveCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postCategory();
    } else if (buttonType === 'put') {
      putCategory();
    }
  };

  // 메뉴 저장
  const onSaveMenu = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postMenu();
    } else if (buttonType === 'put') {
      putMenu();
    }
  };

  // 페이지 데이터 로딩 전엔 Loading 표시
  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      <Dialog
        visible={pageState.openDeleteMenuDialog}
        type="info"
        isConfirm
        onConfirm={deleteMenu}
        onCancel={() =>
          setPageState((state) => ({ ...state, openDeleteMenuDialog: false }))
        }
      >
        정말 삭제하시겠습니까?
      </Dialog>
      <Dialog
        visible={pageState.openDeleteCategoryDialog}
        type="info"
        isConfirm
        onConfirm={deleteCategory}
        onCancel={() =>
          setPageState((state) => ({
            ...state,
            openDeleteCategoryDialog: false,
          }))
        }
      >
        정말 삭제하시겠습니까?
      </Dialog>

      <Container align="right">
        <Button onClick={getMenus}>
          <Icon icon="search" />
          조회
        </Button>
      </Container>

      <Table
        caption="메뉴 자원 목록"
        model={model}
        buttons={buttons}
        enableTreeTable
        disableFilters
        disableSortBy
        data={menus ? menus.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal visible={pageState.openMenuModal} title="메뉴 등록/수정">
        <Form onSubmit={onSaveMenu}>
          <Row>
            <LabelInput
              required
              label="메뉴 코드"
              value={menuCode}
              onChange={onChangeMenuForm}
              name="menuCode"
              disabled={pageState.disableMenuItem}
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴명"
              value={menuName}
              onChange={onChangeMenuForm}
              name="menuName"
            />
          </Row>
          <Row>
            <LabelInput
              label="메뉴 설명"
              value={menuDescription}
              onChange={onChangeMenuForm}
              name="menuDescription"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴 URL"
              value={menuUrl}
              onChange={onChangeMenuForm}
              name="menuUrl"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="상위 카테고리"
              data={hierarchyCategoriesData}
              defaultValue={{ code: '', name: '최상위 카테고리' }}
              value={menuCategory}
              onChange={onChangeMenuForm}
              name="menuCategory"
              disabled={pageState.disableMenuItem}
            />
          </Row>
          <Row>
            <LabelSelect
              label="메뉴 아이콘"
              defaultValue={defaultValue}
              data={iconCodes}
              value={menuIcon}
              onChange={onChangeMenuForm}
              name="menuIcon"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴 정렬"
              value={menuSort}
              onChange={onChangeMenuForm}
              name="menuSort"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="사용 가능 상태"
              data={enableCodes}
              defaultValue={defaultValue}
              value={menuStatus}
              onChange={onChangeMenuForm}
              name="menuStatus"
            />
          </Row>
          <InFormContainer>
            <SaveButton />
            <CloseButton
              onClick={() =>
                setPageState((state) => ({ ...state, openMenuModal: false }))
              }
            />
          </InFormContainer>
        </Form>
      </Modal>

      <Modal visible={pageState.openCategoryModal} title="카테고리 등록/수정">
        <Form onSubmit={onSaveCategory}>
          <Row>
            <LabelInput
              required
              label="카테고리 코드"
              value={categoryCode}
              onChange={onChangeCategoryForm}
              disabled={pageState.disableCategoryItem}
              name="categoryCode"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="카테고리명"
              value={categoryName}
              onChange={onChangeCategoryForm}
              name="categoryName"
            />
          </Row>
          <Row>
            <LabelInput
              label="카테고리 설명"
              value={categoryDescription}
              onChange={onChangeCategoryForm}
              name="categoryDescription"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="상위 카테고리"
              data={hierarchyCategoriesData}
              defaultValue={{ code: '', name: '최상위 카테고리' }}
              value={categoryParent}
              onChange={onChangeCategoryForm}
              disabled={pageState.disableCategoryItem}
              name="categoryParent"
            />
          </Row>
          <Row>
            <LabelSelect
              label="카테고리 아이콘"
              defaultValue={defaultValue}
              data={iconCodes}
              value={categoryIcon}
              onChange={onChangeCategoryForm}
              name="categoryIcon"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="카테고리 정렬"
              value={categorySort}
              onChange={onChangeCategoryForm}
              name="categorySort"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="사용 가능 상태"
              data={enableCodes}
              defaultValue={defaultValue}
              value={categoryStatus}
              onChange={onChangeCategoryForm}
              name="categoryStatus"
            />
          </Row>
          <InFormContainer>
            <SaveButton />
            <CloseButton
              onClick={() =>
                setPageState((state) => ({
                  ...state,
                  openCategoryModal: false,
                }))
              }
            />
          </InFormContainer>
        </Form>
      </Modal>
    </>
  );
}

export default ResourceMenu;
