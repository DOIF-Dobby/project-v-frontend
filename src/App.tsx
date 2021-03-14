import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { theme, GlobalStyle, Page } from 'doif-react-kit';
import styled, { ThemeProvider } from 'styled-components';
import 'doif-react-kit/dist/doif-react-kit.css';
import { Route } from 'react-router-dom';
import Test from './pages/Test';
import Entp1 from './pages/Entp1';
import Entp2 from './pages/Entp2';
import AppMenu from './components/AppMenu';
import AppHeader from './components/AppHeader';
import { useWindowSize } from './hooks/useWindowSize';
import Optr1 from './pages/Optr1';
import Dev1 from './pages/Dev1';

function App() {
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
    <ThemeProvider theme={theme[themeName]}>
      <GlobalStyle />

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
    </ThemeProvider>
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

export default App;
