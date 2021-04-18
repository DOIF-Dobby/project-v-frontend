import axios from 'axios';
import { GlobalStyle, theme as appTheme } from 'doif-react-kit';
import 'doif-react-kit/dist/doif-react-kit.css';
import React from 'react';
import { atom, selector, useRecoilValue, useRecoilValueLoadable } from 'recoil';
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

export const loginState = atom({
  key: 'loginState',
  default: axios.post('/token/check-login').then((res) => res.data),
});

export const loginSelector = selector<boolean>({
  key: 'Index/loginSelector',
  get: ({ get }) => get(loginState),
  set: ({ set }, newValue) => set(loginState, newValue),
});

function Index() {
  const theme = useRecoilValue(themeState);
  const responseStatus = useRecoilValue(responseStatusState);
  const login = useRecoilValueLoadable(loginSelector);

  if (responseStatus >= 400) {
    return <RequestError />;
  }

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={appTheme[theme]}>
        {login.state === 'hasValue' ? (
          login.contents ? (
            <Main />
          ) : (
            <Login />
          )
        ) : (
          <div>크크크앙</div>
        )}
      </ThemeProvider>
    </>
  );
}

export default Index;
