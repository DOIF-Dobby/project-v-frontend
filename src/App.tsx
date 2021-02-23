import React, { useState } from 'react';
import './App.css';
import { theme, GlobalStyle } from 'doif-react-kit';
import styled, { ThemeProvider } from 'styled-components';
import 'doif-react-kit/dist/datepicker.css';
import { Route } from 'react-router-dom';
import Test from './pages/Test';
import Entp1 from './pages/Entp1';
import Entp2 from './pages/Entp2';
import Menu from './components/Menu';

function App() {
  const [themeName, setThemeName] = useState('light');

  return (
    <ThemeProvider theme={theme[themeName]}>
      <GlobalStyle />

      <Menu />

      <PageContainer>
        <Route path="/" component={Test} exact />
        <Route path="/entp1" component={Entp1} />
        <Route path="/entp2" component={Entp2} />
      </PageContainer>
    </ThemeProvider>
  );
}

const PageContainer = styled.div`
  padding-left: 15rem;

  @media only screen and (max-width: 720px) {
    padding-left: 3rem;
  }
`;

export default App;
