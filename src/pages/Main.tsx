import { Box, Container, Page } from 'doif-react-kit';
import React, { useCallback, useEffect, useState } from 'react';
import { Route } from 'react-router';
import styled from 'styled-components';
import AppHeader from '../components/AppHeader';
import AppMenu from '../components/AppMenu';
import { useWindowSize } from '../hooks/useWindowSize';
import ResourceMenu from './developer/ResourceMenu';
import ResourcePage from './developer/ResourcePage';
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
