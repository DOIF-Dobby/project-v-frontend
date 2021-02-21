import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import './App.css';
import { theme, GlobalStyle, SideMenu, MenuProps } from 'doif-react-kit';
import styled, { ThemeProvider } from 'styled-components';
import 'doif-react-kit/dist/datepicker.css';
import { Route } from 'react-router-dom';
import Test from './pages/Test';
import Entp1 from './pages/Entp1';
import Entp2 from './pages/Entp2';

import smallLogo from './images/v-logo-small.png';
import bigLogo from './images/v-logo-big.png';

function App() {
  const [themeName, setThemeName] = useState('light');

  const menus: Array<MenuProps> = [
    {
      code: 'CATEGORY_01',
      name: '기본정보 관리',
      sort: 1,
      depth: 1,
      type: 'CATEGORY',
      icon: 'heart',
    },
    {
      code: 'CATEGORY_01_01',
      name: '가맹점 정보',
      sort: 1,
      depth: 2,
      type: 'CATEGORY',
      icon: '',
    },
    {
      code: 'MENU_01',
      name: '가맹점 정보 관리',
      sort: 1,
      depth: 3,
      type: 'MENU',
      icon: '',
      url: '/entp1',
    },
    {
      code: 'MENU_02',
      name: '계약승인처리',
      sort: 2,
      depth: 3,
      type: 'MENU',
      icon: '',
      url: '/entp2',
    },
    {
      code: 'CATEGORY_01_02',
      name: '원천사업자 정보',
      sort: 2,
      depth: 2,
      type: 'CATEGORY',
      icon: '',
    },
    {
      code: 'MENU_03',
      name: '원천사업자 정보 관리',
      sort: 1,
      depth: 3,
      type: 'MENU',
      icon: '',
      url: '/optr1',
    },
  ];

  return (
    <ThemeProvider theme={theme[themeName]}>
      <GlobalStyle />

      <SideMenu
        smallLogo={<img src={smallLogo} />}
        bigLogo={<img src={bigLogo} />}
        menus={menus}
      />

      <div>
        <Route path="/" component={Test} exact />
        <Route path="/entp1" component={Entp1} />
        <Route path="/entp2" component={Entp2} />
      </div>
    </ThemeProvider>
  );
}

export default App;
