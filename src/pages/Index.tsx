import { GlobalStyle, theme as appTheme } from 'doif-react-kit';
import 'doif-react-kit/dist/doif-react-kit.css';
import React from 'react';
import { Route } from 'react-router';
import { atom, useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';
import RequestError from './errors/RequestError';
import Login from './Login';
import Main from './Main';

export const themeState = atom({
  key: 'themeState',
  default: localStorage.getItem('AppTheme') || 'light',
});

export const responseStatusState = atom({
  key: 'responseStatusState',
  default: 200,
});

function Index() {
  const theme = useRecoilValue(themeState);
  const responseStatus = useRecoilValue(responseStatusState);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme[theme]}>
        <Route path="/login" component={Login} />
        {responseStatus >= 400 ? <RequestError /> : <Main />}
      </ThemeProvider>
    </>
  );
}

export default Index;
