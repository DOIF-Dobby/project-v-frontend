import React, { ChangeEvent, useCallback, useState } from 'react';
import './App.css';
import {
  Button,
  theme,
  GlobalStyle,
  Icon,
  Container,
  Input,
  Check,
  Radio
} from 'doif-react-kit';
import { ThemeProvider } from 'styled-components';

function App() {
  const [themeName, setThemeName] = useState('light');
  const [values, setValues] = useState<Array<string>>([]);
  const [value, setValue] = useState<string>('hi');

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value: codeValue } = e.target;

    setValues((value) =>
      checked
        ? value.concat(codeValue)
        : value.filter((val) => val !== codeValue)
    );
  }, []);

  const onChageRadio = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const data = [
    { code: 'hi', name: '안녕하세요' },
    { code: 'hello', name: '반갑습니다.' },
  ];

  return (
    <ThemeProvider theme={theme[themeName]}>
      <GlobalStyle />
      <Container style={{ alignItems: 'center' }}>
        <Button>안녕</Button>
        <Button color="secondary">안녕</Button>
        <Button color="secondary" variant="outline">
          안녕
        </Button>
        <Icon icon="heart" />
        <Icon icon="heart" color="secondary" />
        <Icon icon="heart" style={{ fill: '#f00', width: '4rem' }} />
        <Button>
          <Icon icon="heart" />
          버튼
        </Button>
        <Button color="secondary" variant="outline">
          버튼
          <Icon icon="heart" color="secondary" />
        </Button>
        <Button iconOnly>
          <Icon icon="heart" />
        </Button>
        <Button
          style={{
            backgroundColor: '#eaeaea',
            borderRadius: '1.25rem',
            width: '2.5rem',
            height: '2.5rem',
          }}
          iconOnly>
          <Icon icon="heart" style={{ fill: '#f00' }} />
        </Button>
        <Input placeholder="안녕하세요" />
        <Input placeholder="안녕하세요" color="secondary" />
        <Input placeholder="안녕하세요" variant="underline" />
        <Input placeholder="안녕하세요" variant="underline" color="secondary" />
        <Input placeholder="안녕하세요" frontIcon={<Icon icon="heart" />} />
        <Input placeholder="안녕하세요" backIcon={<Icon icon="heart" />} />
        <Input
          placeholder="안녕하세요"
          frontIcon={<Icon icon="check" />}
          backIcon={<Icon icon="calendar" />}
        />
        <Input
          placeholder="안녕하세요"
          variant="underline"
          frontIcon={<Icon icon="check" />}
          backIcon={<Icon icon="calendar" />}
        />
        <button
          onClick={() =>
            setThemeName(themeName === 'light' ? 'dark' : 'light')
          }>
          토글
        </button>
      </Container>
      <Container>
        <Check
          data={data}
          values={values}
          name="checkbox1"
          onChange={onChange}
        />
        <Radio data={data} value={value} name="radiobox1" onChange={onChageRadio}/>
      </Container>
    </ThemeProvider>
  );
}

export default App;