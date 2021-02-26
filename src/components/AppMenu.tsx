import React from 'react';
import { SideMenu, MenuProps, CategoryProps } from 'doif-react-kit';
import smallLogo from '../images/v-logo-small.png';
import bigLogo from '../images/v-logo-big.png';

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

interface AppMenuProps {
  isFold: boolean;
}

function AppMenu({ isFold }: AppMenuProps) {
  return (
    <SideMenu
      smallLogo={<img src={smallLogo} alt="로고" />}
      bigLogo={<img src={bigLogo} alt="로고" />}
      items={items}
      isFold={isFold}
    />
  );
}

export default React.memo(AppMenu);
