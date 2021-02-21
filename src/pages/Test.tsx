import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Button,
  theme,
  GlobalStyle,
  Icon,
  Container,
  Input,
  Check,
  Radio,
  Select,
  Tab,
  Page,
  Box,
  Loading,
  Datepicker,
  Textarea,
  MarkdownEditor,
  MarkdownPreview,
  SideMenu,
} from 'doif-react-kit';
import marked from 'marked';

type TestProps = {};

function Test() {
  const [values, setValues] = useState<Array<string>>([]);
  const [value, setValue] = useState<string>('hi');
  const [selected, setSelected] = useState('TAB_1');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [content, setContent] = useState('');

  const markdownRef: React.LegacyRef<HTMLDivElement> = useRef(null);

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

  const onChageSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  }, []);

  const onChangeTab = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  }, []);

  const onChangeMarkdown = useCallback((markdown: string) => {
    setContent(markdown);
  }, []);

  const onChangeDate = useCallback(
    (
      date: Date | null,
      e: SyntheticEvent<any, Event> | undefined,
      name: string | undefined
    ) => {
      setStartDate(date);
    },
    []
  );

  const data = [
    { code: 'hi', name: '안녕하세요' },
    { code: 'hello', name: '반갑습니다.' },
  ];

  const tabs = [
    {
      id: 'TAB_1',
      name: '마크다운 에디터',
      disabled: false,
      content: (
        <MarkdownEditor content={content} onChangeMarkdown={onChangeMarkdown} />
      ),
    },
    {
      id: 'TAB_3',
      name: '마크다운 프리뷰',
      disabled: false,
      content: <MarkdownPreview markdown={marked(content)} />,
    },
  ];

  return (
    <Page>
      <Box>
        {/* <Loading/> */}
        <Container direction="column">
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
            <Input
              placeholder="안녕하세요"
              variant="underline"
              color="secondary"
            />
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
          </Container>
          <Container>
            <Check
              data={data}
              values={values}
              name="checkbox1"
              onChange={onChange}
            />
            <Radio
              data={data}
              value={value}
              name="radiobox1"
              onChange={onChageRadio}
            />
            <Select data={data} value={value} onChange={onChageSelect} />
            <Select
              data={data}
              value={value}
              onChange={onChageSelect}
              variant="underline"
            />
            <Select
              data={data}
              value={value}
              onChange={onChageSelect}
              color="secondary"
            />
            <Select
              data={data}
              value={value}
              onChange={onChageSelect}
              color="secondary"
              variant="underline"
            />
          </Container>
          <Container>
            <Tab
              tabs={tabs}
              selected={selected}
              name="tab-sample"
              onChange={onChangeTab}
            />
          </Container>
          <Container>
            <Datepicker selected={startDate} onChange={onChangeDate} />
            <Textarea />
          </Container>
        </Container>
      </Box>
    </Page>
  );
}

export default Test;
