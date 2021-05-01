import axios from 'axios';
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
import useAsyncAction, {
  deleteAction,
  postAction,
  putAction,
} from '../../../hooks/useAsyncAction';
import useAsyncGet, { getAction } from '../../../hooks/useAsyncGet';
import useButtons, { ButtonInfoProps } from '../../../hooks/useButtons';
import useCodes from '../../../hooks/useCodes';
import usePage from '../../../hooks/usePage';

let row: any = {};
let buttonType: string = '';

function ResourceMenu() {
  const [pageData] = usePage('/api/pages/resources/menu');
  const [menus, getMenus]: any = useAsyncGet(
    () => pageData && getAction(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url),
    [pageData],
  );
  const [enableCodes]: any = useCodes('ENABLE_STATUS', pageData);
  const [hierarchyCategories]: any = useAsyncGet(
    () =>
      pageData && getAction('/api/resources/menu-categories/hierarchy-code'),
    [pageData],
  );

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
        setOpenMenuModal(false);
        getMenus();
      },
    },
  );

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
        setOpenMenuModal(false);
        getMenus();
      },
    },
  );

  const [deleteMenu] = useAsyncAction(
    () => deleteAction('/api/resources/menus/' + row.resourceId),
    {
      onSuccess: () => {
        setDeleteMenuDialog(false);
        getMenus();
      },
    },
  );

  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [modBtnDisable, setModBtnDisable] = useState(true);
  const [delBtnDisable, setDelBtnDisable] = useState(true);
  const [deleteMenuDialog, setDeleteMenuDialog] = useState(false);
  const [menuItemDisable, setMenuItemDisable] = useState(false);

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

  const hierarchyCategoriesData = hierarchyCategories?.map(
    ({ code, name, render }: any) => ({
      code,
      name,
      render: (
        <div style={{ paddingLeft: (render - 1) * 10 + 'px' }}>{name}</div>
      ),
    }),
  );

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

  const {
    categoryCode,
    categoryName,
    categoryDescription,
    categoryParent,
    categoryStatus,
    categoryIcon,
    categorySort,
  } = categoryForm;

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

  const onSelectRow = useCallback((id: string, rowValue: any) => {
    row = rowValue;
    if (rowValue.type === 'MENU') {
      setModBtnDisable(false);
      setDelBtnDisable(false);
    } else {
      setModBtnDisable(true);
      setDelBtnDisable(true);
    }
  }, []);

  const onSaveCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = {
      name: categoryName,
      description: categoryDescription,
      status: categoryStatus,
      code: categoryCode,
      parentId: categoryParent,
      sort: categorySort,
      icon: categoryIcon,
    };

    axios
      .post('/api/resources/menu-categories', params)
      .then((response) => console.log(response));
  };

  const onSaveMenu = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonType === 'post') {
      postMenu();
    } else if (buttonType === 'put') {
      putMenu();
    }
  };

  const defaultValue = {
    code: '',
    name: '선택없음',
  };

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

  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_MENU_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMenuItemDisable(false);
        buttonType = 'post';

        resetMenuForm();
        setOpenMenuModal(true);
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_MODIFY',
      disable: modBtnDisable,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMenuItemDisable(true);
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
        setOpenMenuModal(true);
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_DELETE',
      disable: delBtnDisable,
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDeleteMenuDialog(true);
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_CATEGORY_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        resetCategoryForm();
        setOpenCategoryModal(true);
      },
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  if (!pageData) {
    return <Loading />;
  }

  // console.log(pageData);

  return (
    <>
      <Dialog
        visible={deleteMenuDialog}
        type="info"
        isConfirm
        onConfirm={deleteMenu}
        onCancel={() => setDeleteMenuDialog(false)}
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

      <Modal visible={openMenuModal} title="메뉴 등록/수정">
        <Form onSubmit={onSaveMenu}>
          <Row>
            <LabelInput
              required
              label="메뉴 코드"
              value={menuCode}
              onChange={onChangeMenuForm}
              name="menuCode"
              disabled={menuItemDisable}
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
              disabled={menuItemDisable}
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
            <CloseButton onClick={() => setOpenMenuModal(false)} />
          </InFormContainer>
        </Form>
      </Modal>

      <Modal visible={openCategoryModal} title="카테고리 등록/수정">
        <Form onSubmit={onSaveCategory}>
          <Row>
            <LabelInput
              required
              label="카테고리 코드"
              value={categoryCode}
              onChange={onChangeCategoryForm}
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
            <CloseButton onClick={() => setOpenCategoryModal(false)} />
          </InFormContainer>
        </Form>
      </Modal>
    </>
  );
}

export default ResourceMenu;
