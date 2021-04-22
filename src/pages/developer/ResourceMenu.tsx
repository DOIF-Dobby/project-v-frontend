import axios from 'axios';
import {
  Button,
  CloseButton,
  Container,
  Form,
  Icon,
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
import React, { useCallback, useMemo, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import useButtons, { ButtonInfoProps } from '../../hooks/useButtons';
import usePage from '../../hooks/usePage';

async function getMenus(url: string) {
  const response = await axios.get(url);
  return response.data;
}

function ResourceMenu() {
  const [isLoading, pageData] = usePage('/api/pages/resources/menu');
  const [menuState, refetch]: any = useAsync(
    () => pageData && getMenus(pageData.buttonMap.BTN_RESOURCE_MENU_FIND.url),
    [pageData],
  );

  const [openModal, setOpenModal] = useState(false);
  const [modBtnDisable, setModBtnDisable] = useState(true);
  const [delBtnDisable, setDelBtnDisable] = useState(true);

  const [menuForm, onChangeMenu, resetMenuForm] = useChange({
    menuCode: '',
    menuName: '',
    menuDescription: '',
    menuCategory: '',
    menuUrl: '',
    menuStatus: '',
    menuIcon: '',
    menuSort: '',
  });

  const { data, loading } = menuState;
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
    if (rowValue.type === 'MENU') {
      setModBtnDisable(false);
      setDelBtnDisable(false);
    } else {
      setModBtnDisable(true);
      setDelBtnDisable(true);
    }
  }, []);

  const defaultValue = {
    code: '',
    name: '선택없음',
  };

  const enableStatusData = [
    { code: 'ENABLE', name: '가능' },
    { code: 'DISABLE', name: '불가능' },
  ];

  const buttonInfos: ButtonInfoProps[] = [
    {
      id: 'BTN_RESOURCE_MENU_ADD',
      onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        resetMenuForm();
        setOpenModal(true);
      },
    },
    {
      id: 'BTN_RESOURCE_MENU_MODIFY',
      disable: modBtnDisable,
    },
    {
      id: 'BTN_RESOURCE_MENU_DELETE',
      disable: delBtnDisable,
    },
  ];
  const buttons = useButtons(pageData && pageData.buttonMap, buttonInfos);

  if (!pageData) {
    return <Loading />;
  }

  return (
    <>
      {(isLoading || loading) && <Loading />}
      <Container align="right">
        <Button onClick={refetch}>
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
        data={data ? data.content : []}
        onSelectRow={onSelectRow}
      />

      <Modal visible={openModal} title="메뉴 등록">
        <Form>
          <Row>
            <LabelInput
              required
              label="메뉴 코드"
              value={menuCode}
              onChange={onChangeMenu}
              name="menuCode"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴명"
              value={menuName}
              onChange={onChangeMenu}
              name="menuName"
            />
          </Row>
          <Row>
            <LabelInput
              label="메뉴 설명"
              value={menuDescription}
              onChange={onChangeMenu}
              name="menuDescription"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴 URL"
              value={menuUrl}
              onChange={onChangeMenu}
              name="menuUrl"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="상위 카테고리"
              value={menuCategory}
              onChange={onChangeMenu}
              name="menuCategory"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴 아이콘"
              value={menuIcon}
              onChange={onChangeMenu}
              name="menuIcon"
            />
          </Row>
          <Row>
            <LabelInput
              required
              label="메뉴 정렬"
              value={menuSort}
              onChange={onChangeMenu}
              name="menuSort"
            />
          </Row>
          <Row>
            <LabelSelect
              required
              label="사용 가능 상태"
              data={enableStatusData}
              defaultValue={defaultValue}
              value={menuStatus}
              onChange={onChangeMenu}
              name="menuStatus"
            />
          </Row>
          <InFormContainer>
            <SaveButton />
            <CloseButton onClick={() => setOpenModal(false)} />
          </InFormContainer>
        </Form>
      </Modal>
    </>
  );
}

export default ResourceMenu;
