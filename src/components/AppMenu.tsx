import React, { useCallback, useState } from 'react';
import { SideMenu, MenuProps, CategoryProps } from 'doif-react-kit';
import smallLogo from '../images/v-logo-small.png';
import bigLogo from '../images/v-logo-big.png';
import useAccessToken from '../hooks/useAccessToken';
import axios from 'axios';

interface AppMenuProps {
  isFold: boolean;
}

function AppMenu({ isFold }: AppMenuProps) {
  const [items, setItmes] = useState<Array<CategoryProps | MenuProps>>([]);

  useAccessToken(
    useCallback(() => {
      axios.get('/api/side-menu').then((response) => {
        setItmes(response.data.content);
      });
    }, []),
  );

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
