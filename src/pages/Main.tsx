import { Box, Container, Page } from 'doif-react-kit';
import React, { useCallback, useEffect, useState } from 'react';
import { Route } from 'react-router';
import styled from 'styled-components';
import AppHeader from '../components/AppHeader';
import AppMenu from '../components/AppMenu';
import LoadingAndDialog from '../components/LoadingAndDialog';
import { useWindowSize } from '../hooks/useWindowSize';
import ResourceButton from './developer/button/ResourceButton';
import ResourceLabel from './developer/label/ResourceLabel';
import ResourceMenu from './developer/menu/ResourceMenu';
import ResourceMessage from './developer/message/ResourceMessage';
import ResourcePage from './developer/page/ResourcePage';
import ResourceTab from './developer/tab/ResourceTab';
import SecurityUser from './security/SecurityUser';
import Test from './Test';

function Main() {
  const [isFold, setIsFold] = useState(() => {
    return window.innerWidth < 720;
  });
  const [paddingLeft, setPaddingLeft] = useState(() => {
    return window.innerWidth < 720 ? '3rem' : '15rem';
  });
  const windowSize = useWindowSize();

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
              <LoadingAndDialog />
              <Route path="/" component={Test} exact />

              {/* 보안 관리 카테고리 */}
              <Route path="/security/user" component={SecurityUser} />

              {/* 개발자 카테고리 */}
              <Route path="/dev/menu" component={ResourceMenu} />
              <Route path="/dev/page" component={ResourcePage} />
              <Route path="/dev/label" component={ResourceLabel} />
              <Route path="/dev/button" component={ResourceButton} />
              <Route path="/dev/message" component={ResourceMessage} />
              <Route path="/dev/tab" component={ResourceTab} />
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
