import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import './App.css';
import { theme, GlobalStyle, SideMenu, MenuProps, CategoryProps } from 'doif-react-kit';
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

  const items: Array<CategoryProps | MenuProps> = [
    {
      code: 'CATEGORY_01',
      name: '기본정보 관리',
      icon: 'heart',
      childrenItems: [
        {
          code: 'CATEGORY_01_01',
          name: '가맹점 정보',
          childrenItems: [
            {
              code: 'MENU_01',
              name: '가맹점 정보 관리',
              url: '/entp1',
            },
            {
              code: 'MENU_02',
              name: '계약승인처리',
              url: '/entp2',
            },
          ],
        },
        {
          code: 'CATEGORY_01_02',
          name: '원천사업자 정보',
          icon: '',
          childrenItems: [
            {
              code: 'MENU_03',
              name: '원천사업자 정보 관리',
              url: '/optr1',
            },
          ],
        },
      ],
    },
    {
      code: 'CATEGORY_02',
      name: '개발자 메뉴',
      icon: 'pencil',
      childrenItems: [
        {
          code: 'MENU_DEV_01',
          name: '시스템캐시리로드',
          url: '/dev1',
        },
        {
          code: 'MENU_DEV_02',
          name: '메뉴 관리',
          url: '/dev2',
        },
      ],
    },
    {
      code: 'MENU_04',
      name: '테스트 메뉴',
      icon: 'exit',
      url: '/test',
    },
  ];

  return (
    <ThemeProvider theme={theme[themeName]}>
      <GlobalStyle />

      <SideMenu
        smallLogo={<img src={smallLogo} />}
        bigLogo={<img src={bigLogo} />}
        items={items}
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
