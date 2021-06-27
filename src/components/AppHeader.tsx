import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Header,
  Icon,
  Radio,
  theme,
  useOutsideAlerter,
} from 'doif-react-kit';
import { DoifDataProps } from 'doif-react-kit/dist/types/props/DoifCommonProps';
import _ from 'lodash';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import useAccessToken from '../hooks/useAccessToken';
import defaultProfilePicture from '../images/default-profile-picture.png';
import { loginSelector, themeState } from '../pages/Index';

interface AppHeaderProps {
  paddingLeft: string;
  onClickHamburgerButton: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

function AppHeader({ paddingLeft, onClickHamburgerButton }: AppHeaderProps) {
  const [searchField, setSearchField] = useState<React.ReactNode>('');
  const [profileField, setProfileField] = useState<React.ReactNode>('');
  const [settingField, setSettingField] = useState<React.ReactNode>('');
  const [visibleSearchField, setVisibleSearchField] = useState(false);
  const [visibleProfileField, setVisibleProfileField] = useState(false);
  const [visibleSettingField, setVisibleSettingField] = useState(false);
  const [loginUser, setLoginUser] = useState({
    name: '',
    profilePicture: '',
  });

  const [menuItems, setMenuItems] = useState([]);

  const setLogin = useSetRecoilState(loginSelector);

  const logoutMutation = useMutation(() => axios.post('/logout'), {
    onSuccess: (res) => {
      setLogin(res.data);
    },
  });

  useAccessToken(
    useCallback(() => {
      axios.get('/api/users/login-user').then((response) => {
        setLoginUser(response.data);
      });
    }, []),
  );

  // SearchField 바깥 쪽 클릭했을 때 닫히게 하는 함수
  const searchFieldRef: RefObject<HTMLDivElement> = useRef(null);
  useOutsideAlerter(
    searchFieldRef,
    useCallback(() => setVisibleSearchField(false), []),
  );

  // ProfileField 바깥 쪽 클릭했을 때 닫히게 하는 함수
  const profileFieldRef: RefObject<HTMLDivElement> = useRef(null);
  useOutsideAlerter(
    profileFieldRef,
    useCallback(() => {
      return setVisibleProfileField(false);
    }, []),
  );

  // SettingField 바깥 쪽 클릭했을 때 닫히게 하는 함수
  const settingFieldRef: RefObject<HTMLDivElement> = useRef(null);
  useOutsideAlerter(
    settingFieldRef,
    useCallback(() => {
      return setVisibleSettingField(false);
    }, []),
  );

  /** SearchField 닫기 버튼 클릭했을 때 */
  const onClickSearchItem = useCallback(() => {
    setVisibleSearchField(false);
    setMenuItems([]);
  }, []);

  const onClickLogout = useCallback(() => {
    setVisibleProfileField(false);
    logoutMutation.mutate();
  }, [logoutMutation]);

  /** SettingField 아이템 클릭했을 때 */
  const onClickCloseButton = useCallback(() => {
    setVisibleSettingField(false);
  }, []);

  const onInputDebounceSearch = _.debounce((search: string) => {
    if (search) {
      setVisibleSearchField(true);

      axios
        .get('/api/accessible-menu', {
          params: {
            search,
          },
        })
        .then((response) => {
          const accessibleMenu = response.data.map((menu: any) => {
            return (
              <MenuItem
                key={menu.code}
                menu={menu}
                onClick={onClickSearchItem}
              />
            );
          });

          setSearchField(
            <Box style={{ height: '400px', overflow: 'auto' }}>
              {accessibleMenu}
            </Box>,
          );
        });
    }
  }, 200);

  /** Search 검색했을 때 */
  const onInputSearch = (event: React.FormEvent<HTMLInputElement>) => {
    onInputDebounceSearch(event.currentTarget.value);
  };

  /** Profile 클릭했을 때 */
  const onClickProfile = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setVisibleProfileField((visibleProfileField) => !visibleProfileField);
      const profileItem = (
        <div style={{ padding: '0.5rem' }}>
          <div onClick={onClickLogout}>로그아웃</div>
        </div>
      );

      setProfileField(profileItem);
    },
    [onClickLogout],
  );

  /** Setting 클릭했을 때 */
  const onClickSetting = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setVisibleSettingField((visibleProfileField) => !visibleProfileField);
      setSettingField(<Setting onClickCloseButton={onClickCloseButton} />);
    },
    [onClickCloseButton],
  );

  useEffect(() => {
    setSettingField(<Setting onClickCloseButton={onClickCloseButton} />);
  }, [onClickCloseButton]);

  return (
    <Header
      profileName={loginUser.name}
      left={paddingLeft}
      defaultProfilePicture={
        loginUser.profilePicture ? (
          <img src={loginUser.profilePicture} alt="프로필 이미지" />
        ) : (
          <img src={defaultProfilePicture} alt="프로필 이미지" />
        )
      }
      onClickMenuButton={onClickHamburgerButton}
      onInputSearch={onInputSearch}
      searchField={searchField}
      visibleSearchField={visibleSearchField}
      searchFieldRef={searchFieldRef}
      onClickProfile={onClickProfile}
      profileField={profileField}
      visibleProfileField={visibleProfileField}
      profileFieldRef={profileFieldRef}
      onClickSetting={onClickSetting}
      settingField={settingField}
      visibleSettingField={visibleSettingField}
      settingFieldRef={settingFieldRef}
    />
  );
}

interface SettingProps {
  onClickCloseButton: () => void;
}

const themeData: Array<DoifDataProps> = Object.keys(theme).map((t) => ({
  code: t,
  name: t,
}));

const StyledMenuItem = styled.div`
  /* background-color: ${(props) => props.theme.subColors.pageBackground}; */

  & + & {
    padding-top: 0.25rem;
    border-top: 1px dashed ${(props) => props.theme.subColors.pageBackground};
  }

  a {
    text-decoration: none;
  }

  div.menu-wrapper {
    /* background-color: ${(props) => props.theme.subColors.boxBackground}; */
    padding: 0.5rem;
    border-radius: 4px;
  }

  div.menu-path {
    color: ${(props) => props.theme.pageHeaderColors.menuListItemName};
    font-size: 0.9rem;
  }

  div.menu-name {
    color: ${(props) => props.theme.pageHeaderColors.menuName};
  }
`;

function MenuItem({ menu, onClick }: any) {
  return (
    <StyledMenuItem>
      <Link to={menu.url} onClick={onClick}>
        <div className="menu-wrapper">
          <div className="menu-path">{menu.menuPath}</div>
          <div className="menu-name">{menu.name}</div>
        </div>
      </Link>
    </StyledMenuItem>
  );
}

function Setting({ onClickCloseButton }: SettingProps) {
  const [theme, setTheme] = useRecoilState(themeState);

  const onClickTheme = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTheme(e.target.value);
      localStorage.setItem('AppTheme', e.target.value);
    },
    [setTheme],
  );

  return (
    <Container style={{ padding: '0.5rem' }} direction="column">
      <Container align="right">
        <Button
          iconOnly
          variant="ghost"
          style={{
            borderRadius: '1.125rem',
            width: '2.25rem',
            height: '2.25rem',
          }}
          onClick={onClickCloseButton}
        >
          <Icon icon="exit" />
        </Button>
      </Container>
      <Container>
        <Radio
          data={themeData}
          name="themes"
          value={theme}
          onChange={onClickTheme}
        />
      </Container>
    </Container>
  );
}

export default React.memo(AppHeader);
