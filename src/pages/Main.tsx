import { Page } from 'doif-react-kit';
import React, { useCallback, useEffect, useState } from 'react';
import { Route } from 'react-router';
import styled from 'styled-components';
import AppHeader from '../components/AppHeader';
import AppMenu from '../components/AppMenu';
import { useWindowSize } from '../hooks/useWindowSize';
import Dev1 from './Dev1';
import Entp1 from './Entp1';
import Entp2 from './Entp2';
import Optr1 from './Optr1';
import Test from './Test';

function Main() {
  const [themeName, setThemeName] = useState('light');
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

  const onClickTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeName(e.target.value);
  }, []);

  useEffect(() => {
    setPaddingLeft(isFold ? '3rem' : '15rem');
  }, [isFold]);

  return (
    <>
      <AppHeader
        onClickHamburgerButton={onClickHamburgerButton}
        onClickTheme={onClickTheme}
        paddingLeft={paddingLeft}
        currentTheme={themeName}
      />
      <AppMenu isFold={isFold} />

      <PageContainer paddingLeft={paddingLeft}>
        <Page>
          <Route path="/" component={Test} exact />
          <Route path="/entp1" component={Entp1} />
          <Route path="/entp2" component={Entp2} />
          <Route path="/optr1" component={Optr1} />
          <Route path="/dev1" component={Dev1} />
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
