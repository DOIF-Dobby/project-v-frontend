import axios from 'axios';
import base64 from 'base-64';
import {
  Button,
  Container,
  Dialog,
  Form,
  InFormContainer,
  Input,
  Loading,
  useChange,
} from 'doif-react-kit';
import React, { FormEvent, useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { loginSelector } from './Index';

function Login() {
  const setLogin = useSetRecoilState(loginSelector);
  const loginMutation = useMutation(
    () =>
      axios.post(
        '/login',
        {},
        {
          headers: {
            Authorization: `Basic ${base64.encode(id + ':' + password)}`,
          },
        },
      ),
    {
      onSuccess: (data) => {
        setLogin(true);
      },
      onError: (err) => {
        setError(() => true);
      },
    },
  );

  const [inputForm, onChange] = useChange({
    id: '',
    password: '',
  });
  const [error, setError] = useState(false);

  const { id, password } = inputForm;

  const onLogin = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      loginMutation.mutate();
    },
    [loginMutation],
  );

  const onConfirm = useCallback(() => {
    setError(() => false);
  }, []);

  return (
    <>
      {loginMutation.isLoading && <Loading />}
      <Dialog visible={error} type="error" onConfirm={onConfirm}>
        아이디 또는 패스워드가 일치하지 않습니다.
      </Dialog>
      <LoginContainer>
        <div>
          <h1>로그인 페이지</h1>
          <hr />
          <Form onSubmit={onLogin}>
            <Container direction="column">
              <Input
                variant="underline"
                placeholder="ID"
                value={id}
                name="id"
                onChange={onChange}
              />
              <Input
                type="password"
                variant="underline"
                placeholder="Password"
                value={password}
                name="password"
                onChange={onChange}
              />
            </Container>
            <InFormContainer align="center">
              <Button type="submit">로그인</Button>
            </InFormContainer>
          </Form>
        </div>
      </LoginContainer>
    </>
  );
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;

  > div {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
`;

export default Login;
