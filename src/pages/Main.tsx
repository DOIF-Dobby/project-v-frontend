import { Box, Container, Dialog, Loading, Page } from 'doif-react-kit';
import React, { useCallback, useEffect, useState } from 'react';
import { Route } from 'react-router';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import AppHeader from '../components/AppHeader';
import AppMenu from '../components/AppMenu';
import { useWindowSize } from '../hooks/useWindowSize';
import ResourceMenu from './developer/ResourceMenu';
import ResourcePage from './developer/ResourcePage';
import Test from './Test';

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export type DialogProps = {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  content: React.ReactNode;
};

export const dialogState = atom<DialogProps>({
  key: 'dialogState',
  default: {
    visible: false,
    type: 'info',
    content: '',
  },
});

function Main() {
  const [isFold, setIsFold] = useState(() => {
    return window.innerWidth < 720;
  });
  const [paddingLeft, setPaddingLeft] = useState(() => {
    return window.innerWidth < 720 ? '3rem' : '15rem';
  });
  const windowSize = useWindowSize();
  const loading = useRecoilValue(loadingState);
  const [dialog, setDialog] = useRecoilState(dialogState);

  useEffect(() => {
    const isFold = windowSize.width
      ? windowSize.width < 720
        ? true
        : false
      : false;

    setIsFold(() => isFold);
    setPaddingLeft(isFold ? '3rem' : '15rem');
  }, [windowSize]);

  const onClickHamburgerButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setIsFold((isFold) => !isFold);
    },
    [],
  );

  const onCloseDialog = useCallback(
    () => setDialog((data) => ({ ...data, visible: false })),
    [setDialog],
  );

  useEffect(() => {
    setPaddingLeft(isFold ? '3rem' : '15rem');
  }, [isFold]);

  return (
    <>
      <AppHeader
        onClickHamburgerButton={onClickHamburgerButton}
        paddingLeft={paddingLeft}
      />
      <AppMenu isFold={isFold} />

      <PageContainer paddingLeft={paddingLeft}>
        <Page>
          <Box style={{ minHeight: '860px' }}>
            <Container direction="column">
              {loading && <Loading />}
              <Dialog
                visible={dialog.visible}
                type={dialog.type}
                onConfirm={onCloseDialog}
              >
                {dialog.content}
              </Dialog>
              <Route path="/" component={Test} exact />
              <Route path="/dev/menu" component={ResourceMenu} />
              <Route path="/dev/page" component={ResourcePage} />
            </Container>
          </Box>
        </Page>
      </PageContainer>
    </>
  );
}

interface PageContainerProps {
  paddingLeft: string;
}

const PageContainer = styled.div<PageContainerProps>`
  left: ${(props) => props.paddingLeft};
  top: 3rem;
  width: calc(100% - ${(props) => props.paddingLeft});
  min-height: calc(100% - 3rem);
  background-color: ${(props) => props.theme.subColors.pageBackground};
  position: absolute;

  /* @media only screen and (max-width: 720px) {
    padding-left: 3rem;
  } */
`;

export default Main;
