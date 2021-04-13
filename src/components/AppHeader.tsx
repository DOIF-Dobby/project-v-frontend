import {
  Button,
  Container,
  Header,
  Icon,
  Radio,
  useOutsideAlerter,
  theme,
} from 'doif-react-kit';
import { DoifDataProps } from 'doif-react-kit/dist/types/props/DoifCommonProps';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import defaultProfilePicture from '../images/default-profile-picture.png';
import { themeState } from '../pages/Index';

interface AppHeaderProps {
  paddingLeft: string;
  currentTheme: string;
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
  }, []);

  /** ProfileField 아이템 클릭했을 때 */
  const onClickProfileItem = useCallback(() => {
    setVisibleProfileField(false);
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
  }, []);

  /** SettingField 아이템 클릭했을 때 */
  const onClickCloseButton = useCallback(() => {
    setVisibleSettingField(false);
  }, []);

  /** Search 검색했을 때 */
  const onInputSearch = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setVisibleSearchField(true);
      const searchItem = (
        <div style={{ padding: '0.5rem' }}>
          <div style={{ border: `1px solid red` }} onClick={onClickSearchItem}>
            {event.currentTarget.value}
          </div>
        </div>
      );

      setSearchField(searchItem);
    },
    [onClickSearchItem],
  );

  /** Profile 클릭했을 때 */
  const onClickProfile = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setVisibleProfileField((visibleProfileField) => !visibleProfileField);
      const profileItem = (
        <div style={{ padding: '0.5rem' }}>
          <div style={{ border: `1px solid red` }} onClick={onClickProfileItem}>
            프로필 변경
          </div>
          <div style={{ border: `1px solid red` }} onClick={onClickProfileItem}>
            로그아웃
          </div>
        </div>
      );

      setProfileField(profileItem);
    },
    [onClickProfileItem],
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
      profileName="임진성"
      left={paddingLeft}
      defaultProfilePicture={
        <img src={defaultProfilePicture} alt="프로필 이미지" />
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

function Setting({ onClickCloseButton }: SettingProps) {
  const [theme, setTheme] = useRecoilState(themeState);

  const onClickTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
    localStorage.setItem('AppTheme', e.target.value);
  }, []);

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
